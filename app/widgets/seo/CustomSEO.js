// import node module libraries
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

const CustomSEO = props => {
    const router = useRouter()
    const pageURL = process.env.baseURL + router.pathname;
    const { title, description } = props;
    return (
        <NextSeo
        title={title}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: title,
          description: description,
          site_name: process.env.siteName,
        }}
      />
    )
}
export default CustomSEO;