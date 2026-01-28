import MiniWebsiteContent from '@/components/MiniWebsiteContent'

export default async function MiniWebsitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  return <MiniWebsiteContent slug={slug} />
}