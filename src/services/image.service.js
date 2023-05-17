const vision = require('@google-cloud/vision')
const { getBlob,putBlob } =  require('../utilities/storage.utility')

const imageService = async (buffer) => {

    //Upload image to google cloud storage(buckets)
    const blobName = await putBlob(buffer, ".jpg")

    const blob = await getBlob(blobName)

    const imageAnnotator = new vision.ImageAnnotatorClient(
        {
            projectId: process.env.GCS_PROJECT_ID,
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            credentials: {
              client_email: process.env.GCS_EMAIL,
              private_key: process.env.GCS_PRIVATE_KEY
            }
        }
    );
    const results = await imageAnnotator.documentTextDetection(blob)
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
    return {message:responses.map((r) => ({ type: 'text', text: r })),blobName:blobName}
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