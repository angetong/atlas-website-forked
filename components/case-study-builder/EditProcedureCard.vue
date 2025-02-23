<template>
  <v-card v-if="!isEditing">
    <v-card-title style="font-size: 1.1rem">
      {{ techniqueTitle }}
      <v-spacer />
    </v-card-title>

    <v-card-subtitle>
      {{ tacticName }}
    </v-card-subtitle>
    <v-card-text v-html="$md.render(info.description)" />
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue" icon @click="editStep">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" width="500">
        <template #activator="{ on, attrs }">
          <v-btn color="red" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <confirm-delete-dialog
          :name="comboName"
          @cancel="dialog = false"
          @delete="deleteStep"
        >
          <div v-html="info.description" />
        </confirm-delete-dialog>
      </v-dialog>
    </v-card-actions>
  </v-card>

  <div v-else>
    <v-card :style="cardStyle" :outlined="hasStatus">
      <v-card-title :style="headerStyle">
        Edit Procedure Step
        <v-spacer />
      </v-card-title>
      <procedure-form
        :key="selectTacticData"
        :select-tactic-data="selectTacticData"
        :select-technique-data="selectTechniqueData"
        :description-data="descriptionData"
        @tacticUpdate="selectTacticData = $event"
        @techniqueUpdate="selectTechniqueData = $event"
        @descriptionUpdate="descriptionData = $event"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn class="ma-2" text color="grey" @click="cancelEdit">
          Cancel
        </v-btn>
        <v-btn
          id="save_procedure_button"
          class="ma-2"
          text
          color="green"
          @click="submitEdit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
      {{
        submissionStatus.message
      }}
    </v-card-subtitle>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditProcedureCard',
  props: ['info', 'editedObj', 'editing', 'submissionStatus'],
  data () {
    return {
      wasEditing: false,
      editingData: this.editing,
      selectTacticData: this.info.tactic,
      selectTechniqueData: this.info.technique,
      descriptionData: this.info.description,
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['getDataObjectById', 'subtechnique/getParent']),
    isEditing () {
      return this.editingData
    },
    hasStatus () {
      return this.wasEditing && (!!(this.submissionStatus ?? {}).type)
    },
    isInErrorState () {
      return this.hasStatus && (this.submissionStatus ?? {}).type === 'error'
    },
    isInWarningState () {
      return this.hasStatus && (this.submissionStatus ?? []).type === 'warning'
    },
    headerStyle () {
      if (this.isInErrorState) {
        return 'color: #FF5252'
      } else if (this.isInWarningState) {
        return 'color: #DAA520'
      } else {
        return ''
      }
    },
    cardStyle () {
      const style = {}
      if (this.isInErrorState) {
        style['border-color'] = '#FF5252'
        style['border-width'] = '2px'
      } else if (this.isInWarningState) {
        style['border-color'] = '#DAA520'
        style['border-width'] = '2px'
      }
      return style
    },
    tactic () {
      return this.getDataObjectById(this.selectTacticData)
    },
    technique () {
      return this.getDataObjectById(this.selectTechniqueData)
    },
    tacticName () {
      if (this.tactic === undefined) {
        return '(Name not found for tactic ' + this.info.tactic + ')'
      }
      return this.tactic.name
    },
    techniqueName () {
      if (this.technique === undefined) {
        return '(Name not found for technique ' + this.info.technique + ')'
      }
      return this.technique.name
    },
    techniqueTitle () {
      // Prepend parent technique name for a subtechnique
      if ('subtechnique-of' in this.technique) {
        const parentTechnique = this.$store.getters['subtechnique/getParent'](
          this.technique
        )
        return `${parentTechnique.name}: ${this.technique.name}`
      }
      // Otherwise use the name
      return this.technique.name
    },
    comboName () {
      return `${this.techniqueName} - ${this.tacticName}`
    }
  },
  methods: {
    deleteStep () {
      this.$emit('deleteClick')
    },
    editStep () {
      this.editingData = true
      this.$emit('updateEdit', this.editingData)
    },
    submitEdit () {
      this.wasEditing = false
      this.editingData = false
      this.$emit('updateEdit', this.editingData)
      // .trim() doesn't modify original string
      this.descriptionData = this.descriptionData.trim()
      const editedObj = {
        tactic: this.selectTacticData,
        technique: this.selectTechniqueData,
        description: this.descriptionData
      }
      this.$emit('editClick', editedObj)
      this.$emit('replace')
    },
    cancelEdit () {
      this.wasEditing = false
      this.editingData = false
      this.$emit('updateEdit', this.editingData)
    }
  }
}
</script>
