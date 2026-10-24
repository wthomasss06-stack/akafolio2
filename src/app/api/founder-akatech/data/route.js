import portfolioData from '../../../../lib/founder-akatech/portfolioData.js'

export const dynamic = 'force-static'

export async function GET() {
  const serialized = JSON.stringify(portfolioData).replace(/</g, '\\u003c')
  const script = `window.PORTFOLIO = ${serialized};
window.PORTFOLIO.UI.waProject = (title, rubrique) => \`Bonjour, j'ai vu « \${title} » sur votre portfolio. J'aimerais un projet similaire (\${rubrique}).\`;
window.PORTFOLIO.UI.waService = (title) => \`Bonjour, je suis intéressé par : \${title}.\`;
window.PORTFOLIO.UI.waPlan = (plan, tab, price) => \`Bonjour, je suis intéressé par la formule \${plan} (\${tab}) à \${price}.\`;
`
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
