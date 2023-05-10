const vision = require('@google-cloud/vision')
const { getBlob } =  require('./TemporaryBlobStorage')
const { TextMessage } = require('@line/bot-sdk')

const ImageMessageHandler = (text) => {
  
  if (text.startsWith('image:')) {
    return async () => {
      const blobName = text.slice(6)
      const buffer = await getBlob(blobName)
      const imageAnnotator = new vision.ImageAnnotatorClient({keyFilename:'../personal-assistant-bot-386307-622f3c38f621.json'})
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
      
      const responses = blocksToResponses(blocks)
      
      return [
        { type: 'text', text: blobName },
        ...responses.map((r) => ({ type: 'text', text: r })),
      ]
    }
  }
}

const handler = {
  ImageMessageHandler
};

module.exports = handler;