const vision = require('@google-cloud/vision')
const { getBlob,putBlob } =  require('../utilities/storage.utility')

const imageService = async (buffer) => {

    //Upload image to google cloud storage(buckets)
    const text = await putBlob(buffer, ".jpg")

  if (text.startsWith('image:')) {
    const blobName = text.slice(6)
    const buffer = await getBlob(blobName)
    console.log('image buffer : ',buffer)
    const imageAnnotator = new vision.ImageAnnotatorClient()
    const results = await imageAnnotator.documentTextDetection(buffer)
    const fullTextAnnotation = results[0].fullTextAnnotation
    
    let blocks = []
    
    for (const page of fullTextAnnotation.pages) {
        blocks.push(
            ...page.blocks.map((block) => {
            return block.paragraphs
                .map((p) =>
                p.words
                    .map((w) => w.symbols.map((s) => s.text).join(''))
                    .join(' ')
                )
                .join('\n\n')
            })
        )
    }
        
    const responses = blocksToResponses(blocks)
    
    return responses.map((r) => ({ type: 'text', text: r }))
  }
}

const blocksToResponses = (blocks) => {
        
    if (blocks.length <= 4) return blocks
    
    let processedIndex = 0
    const outBlocks = []
    
    for (let i = 0; i < 4; i++) {
      const targetIndex = Math.ceil(((i + 1) * blocks.length) / 4)
      outBlocks.push(
        blocks
          .slice(processedIndex, targetIndex)
          .map((x) => `・ ${x}`)
          .join('\n')
      )
      processedIndex = targetIndex
    }
    
    return outBlocks
}

module.exports = imageService;