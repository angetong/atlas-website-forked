/* eslint-disable */
const fs = require('fs').promises
const yaml = require('js-yaml')
import { dataObjectToRoute } from '@/assets/tools.js'

export const state = () => ({
  data: {}
})

export const getters = {
  getDataAttribute: (state) => (key) => state.data[key],

  // Get a single array of all objects
  getDataObjects: (state) => Object.values(state.data.objects).flat(),

  getDataObjectsByType: (state) => (objType) => {
    // Returns a list of data objects under the provided object type
    return state.data.objects[objType]
  },

  getDataObjectsByTypeKeyValue: (_, getters) => (objType, key, value) => {
    // Retrieves a list of data objects
    const objs = getters.getDataObjectsByType(objType)
    // Return the first data object whose key-value matches the provided value argument
    return objs.filter(obj => obj[key] === value)
  },
  getDataObjectsByTypeKeyContainingValue: (_, getters) => (objType, key, value) => {
    // Retrieves a list of data objects
    const objs = getters.getDataObjectsByType(objType)
    // Return the data objects whose key includes the provided value argument
    return objs.filter(obj => (key in obj) && obj[key].includes(value))
  },

  getReferencedDataObjects: (_, getters) => (argObj) => {
    // Returns an object with key/object-type to array of objects referenced by this object

    const defaultDataObjectKeys = [
      'id',
      'object-type',
      'name',
      'description'
    ]

    // Get object keys that may be references, i.e. are not default
    const dataKeys = Object.keys(argObj).filter((value) => {
      return !defaultDataObjectKeys.includes(value)
    })

    // IDs of objects directly referenced by this page's object
    const referencedObjects = {}
    dataKeys.forEach((key) => {
      const value = argObj[key]
      if (Array.isArray(value)) {
        referencedObjects[key] = value.map(id => getters.getDataObjectById(id)).flat()
      } else {
        // Single value, create a single-element Array
        referencedObjects[key] = [getters.getDataObjectById(value)]
      }
    })

    // Handle subtechnique-of title
    if ('subtechnique-of' in referencedObjects) {
      referencedObjects['parent-technique'] = referencedObjects['subtechnique-of']
      delete referencedObjects['subtechnique-of']
    }

    return referencedObjects
  },

  getDataObjectsReferencing: (_, getters) => (argObj) => {
    // Return an object with key/object-type to array of objects that reference this object

    const id = argObj.id

    // Find objects that reference this object's ID
    let objects = getters.getDataObjects.filter((obj) => {
      return obj.id !== id && Object.values(obj).flat().includes(id)
    })

    // Other subtechniques
    if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
      const parentTechniqueId = id.substring(0, id.lastIndexOf('.'))
      const otherSubtechniques = getters.getDataObjectsByTypeKeyValue('techniques', 'subtechnique-of', parentTechniqueId)
      // Add other subtechniques that aren't this one
      objects = objects.concat(otherSubtechniques.filter(t => t.id !== id))
    }

    // Add subtechniques of tactics to the technique list
    if (argObj['object-type'] === 'tactic') {
      let subtechniques = []
      objects.forEach((obj) => {
        if (obj['object-type'] === 'technique') {
          subtechniques = subtechniques.concat(getters.getDataObjectsByTypeKeyValue('techniques', 'subtechnique-of', obj.id))
        }
      })
      objects = objects.concat(subtechniques)
    }

    // Look for case studies with the singular key in its procedure, i.e. technique or tactic
    if (argObj['object-type'] === 'tactic' || argObj['object-type'] === 'technique') {
      const studies = getters.getDataObjectsByType('case-studies')
        .filter(study => study.procedure
          // singular key, i.e. technique vs. techniques
          .some(step => step[argObj['object-type']] === id)
        )

      objects = objects.concat(studies)
    }

    // Group by object type
    const results = objects.reduce(
      (acc, obj) => {
        var objectType = obj['object-type']
        if (!acc[objectType]) {
          acc[objectType] = []
        }
        acc[objectType].push(obj)
        return acc
      },
      {}
    )

    // Label subtechniques if available
    if ('technique' in results && argObj['object-type'] === 'technique') {
      let subtechniqueKey = 'subtechniques'
      if (argObj['object-type'] === 'technique' && 'subtechnique-of' in argObj) {
        subtechniqueKey = 'other subtechniques'
      }
      // Relabel the techniques found
      results[subtechniqueKey] = results['technique']
      delete results['technique']
    }

    return results
  },

  getRelatedDataObjects: (_, getters) => (argObj) => {
    // Returns an object of key/object-type to array of data objects related to this object
    return {
      ...getters.getReferencedDataObjects(argObj),
      ...getters.getDataObjectsReferencing(argObj)
    }
  },

  getDataObjectById: (_, getters) => (value) => {
    // Returns the data object with the corresponding ID
    return getters.getDataObjects.find(obj => obj['id'] === value)
  }
}


export const mutations = {
  SET_ATLAS_DATA (state, payload) {
    state.data = { ...state.data, ...payload}
  }
}

export const actions = {
  // Note that this function is called for every dynamic route generated via nuxt generate
  // TODO Caching, also needs return or await
  async nuxtServerInit ({ commit }) {
    // Retrieve the threat matrix YAML data and populate store upon start
    const getAtlasData = await fs.readFile('static/atlas-data/dist/ATLAS.yaml', 'utf-8')

    // Get all contents, then parse and commit payload
    const promise = Promise.resolve(getAtlasData)
      .then((contents) => {

        // Parse YAML
        const data = yaml.load(contents)

        // Collect data objects under the key 'objects'
        const {id, name, version, ...objects} = data
        const result = {id, name, version, objects}

        // Add a property for the data object's internal link
        const dataObjs = Object.values(result.objects).flat()
        dataObjs.forEach((dataObj) => {
          dataObj.route = dataObjectToRoute(dataObj)
        })

        commit('SET_ATLAS_DATA', result)
      })

    return promise
  }
}
