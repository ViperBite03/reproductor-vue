const iconGen = require('icon-gen')
const path = require('path')

const input = path.resolve('./src/favicon.png') // Usa una imagen grande (mínimo 256x256)
const output = path.resolve('./src/favicons')

iconGen(input, output, {
  report: true,
  ico: {
    sizes: [16, 24, 32, 48, 64, 128, 256],
  },
})
  .then(() => console.log('✅ Icono .ico generado con éxito'))
  .catch((err) => console.error('❌ Error generando icono:', err))
