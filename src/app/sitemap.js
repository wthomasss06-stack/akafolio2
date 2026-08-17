export default function sitemap() {
  const baseUrl = 'https://mbolloaka-dev.vercel.app'
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
