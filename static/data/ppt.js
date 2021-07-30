// Powerpoint creation script
import Pptxgen from 'pptxgenjs'
// import { getters } from '../../store/index.js'

function makePPT (yaml) {
  const ppt = new Pptxgen()
  titleSlide(ppt, yaml)
  detailSlide(ppt, yaml)
  procedureSlide(ppt, yaml)
  if (yaml.study.references) {
    referenceSlide(ppt, yaml)
  }

  ppt.writeFile({ fileName: `${yaml.study.name}-PPT.pptx` })
}

function titleSlide (ppt, yaml) {
  const slide = ppt.addSlide({ masterName: 'MASTER_SLIDE' })
  slide.addText([
    { text: yaml.study.name }
  ],
  {
    x: 0,
    y: '25%',
    w: '100%',
    h: 2.5,
    valign: 'middle',
    align: 'center',
    color: '03256C',
    fill: 'ADD9F4',
    fontSize: 48
  })
}

function detailSlide (ppt, yaml) {
  const slide = ppt.addSlide()
  slide.addText([
    { text: 'Case Study Details' }
  ],
  {
    x: 0,
    y: 0,
    w: '100%',
    h: 1,
    color: 'FFFFFF',
    fill: 'EF5B5B',
    fontSize: 30
  })
  slide.addText([
    { text: 'Summary:', options: { color: '03256C', breakLine: true, fontSize: 24 } },
    { text: yaml.study.summary, options: { color: '03256C', breakLine: true, fontSize: 18, indentLevel: 1 } }
  ],
  {
    y: 2.5
  })
  slide.addText([
    { text: 'Reported By: ', options: { color: '03256C', fontSize: 18 } },
    { text: yaml.study['reported-by'], options: { color: '03256C', fontSize: 18 } }
  ],
  {
    y: '80%'
  })
  slide.addText([
    { text: 'Date: ', options: { color: '03256C', fontSize: 18 } },
    { text: yaml.study['incident-date'], options: { color: '03256C', fontSize: 18 } }
  ],
  {
    y: '90%'
  })
}

function procedureSlide (ppt, yaml) {
  const rows = [[
    { text: 'Tactic', options: { fill: 'ADD9F4', color: '03256C', align: 'center', bold: true } },
    { text: 'Technique', options: { fill: 'ADD9F4', color: '03256C', align: 'center', bold: true } },
    { text: 'Description', options: { fill: 'ADD9F4', color: '03256C', align: 'center', bold: true } }
  ]]
  for (let i = 0; i < yaml.study.procedure.length; i++) {
    // const tactic = getters.getTacticById(yaml.study.procedure[i].tactic)
    const tactic = this.$tacticbyid(yaml.study.procedure[i].tactic)
    console.log(yaml.study.procedure[i].tactic)
    console.log(tactic)
    const r = [tactic.name, yaml.study.procedure[i].technique, yaml.study.procedure[i].description]
    rows.push(r)
  }
  const slide = ppt.addSlide()
  slide.addText([
    { text: 'Procedure' }
  ],
  {
    x: 0,
    y: 0,
    w: '100%',
    h: 1,
    color: 'FFFFFF',
    fill: 'EF5B5B',
    fontSize: 30
  })
  slide.addTable(rows,
    {
      y: 1.5,
      colW: [1, 1, 7],
      w: 9,
      color: '03256C',
      autoPage: true,
      autoPageRepeatHeader: true,
      border: { color: '03256C' },
      margin: 10
    })
}

function referenceSlide (ppt, yaml) {
  let i = 0
  while (i < yaml.study.references.length) {
    const lim = i + 5 > yaml.study.references.length ? yaml.study.references.length : i + 5
    const slide = ppt.addSlide()
    slide.addText([
      { text: 'References' }
    ],
    {
      x: 0,
      y: 0,
      w: '100%',
      h: 1,
      color: 'FFFFFF',
      fill: 'EF5B5B',
      fontSize: 30
    })
    let y = 30
    while (i < lim) {
      if (yaml.study.references[i].sourceDescription) {
        slide.addText([
          { text: yaml.study.references[i].sourceDescription }
        ], { y: '' + y + '%', color: '03256C', fontSize: 22 })
        if (yaml.study.references[i].url) { y += 5 }
      }
      if (yaml.study.references[i].url) {
        slide.addText([
          { text: yaml.study.references[i].url, options: { hyperlink: { url: yaml.study.references[i].url } } }
        ], { y: '' + y + '%', color: '03256C', fontSize: 22 })
      }
      y += 15
      i++
    }
  }
}

export { makePPT }
