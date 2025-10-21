/** @type {import('next').NextConfig} */
console.log('LOADING next.config.js — exportGlobals ENABLED')

const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  webpack(config) {
    try {
      const rules = config.module?.rules || []
      console.log('rules count:', rules.length)

      rules.forEach((rule) => {
        if (!rule.oneOf) return
        rule.oneOf.forEach((one) => {
          const uses = one.use ? (Array.isArray(one.use) ? one.use : [one.use]) : []
          uses.forEach((u) => {
            if (
              u &&
              typeof u.loader === 'string' &&
              u.loader.includes('css-loader') &&
              u.options &&
              u.options.modules
            ) {
              u.options.modules.exportGlobals = true
              console.log('enabled exportGlobals on loader', u.loader)
            }
          })
        })
      })
    } catch (err) {
      console.error('Error while patching css-loader options:', err)
    }
    return config
  },
}

module.exports = nextConfig
