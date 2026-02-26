export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        // removed image.setAttribute('crossOrigin', 'anonymous') -> Causes empty canvas for object URLs
        image.src = url
    })

export default async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // set canvas size to match the bounding box
    canvas.width = image.width
    canvas.height = image.height

    ctx.translate(image.width / 2, image.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    ctx.drawImage(image, 0, 0)

    // extract the cropped image
    const croppedCanvas = document.createElement('canvas')
    const croppedCtx = croppedCanvas.getContext('2d')

    if (!croppedCtx) {
        return null
    }

    croppedCanvas.width = pixelCrop.width
    croppedCanvas.height = pixelCrop.height

    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    return new Promise((resolve, reject) => {
        // Output as compressed JPEG format
        croppedCanvas.toBlob((file) => {
            if (file) {
                resolve(new File([file], 'cropped.jpeg', { type: 'image/jpeg' }))
            } else {
                reject(new Error('Canvas is empty'))
            }
        }, 'image/jpeg', 0.8)
    })
}
