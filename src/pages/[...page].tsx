import { HomeAside, HomeAsideMobile, HomeCurrentPage, HomeHeader, HomeLanguage, HomeMainContent } from "@/components/components";
import { Text, Flex, Box, IconButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { language, section, subsection } from "@/interfaces/contentProps";
import { galleryItem, linkItem, textItem } from "@/interfaces/itensProps";
import allData from "../../public/allData.json";
import Head from "next/head";

interface InitialHomeProps {
  page: string
  subpage: string | null
  lang: string
  data: section[]
  content: (textItem | linkItem | galleryItem)[]
  languages: language[]
  projectVersion: string
}

export default function InitialHome({ page, subpage, lang, data, content, languages, projectVersion }: InitialHomeProps) {
  const controller = useDisclosure()

  return (
    <>
      <Head>
        <title>{page ? (`${subpage ? `${page} - ${subpage}` : page}`) : "Manual de Utilização do Sistema"}</title>
      </Head>
      <HomeAsideMobile controller={controller} data={data}/>

      <Flex bgColor={"gray.100"} color={"black"} _dark={{ color: "white", bgColor: "gray.900" }} direction={"column"} minH={"100vh"} h={"full"} alignItems={"center"}>
        <HomeHeader data={data} lang={lang}/>
        <Flex w={"full"} maxW={"1400px"} flex={1} py={8} pr={{ base: 4, sm: 8, md: 12 }} pl={{ base: 4, sm: 8, md: 12 }} overflow={{ base: "auto", md: "hidden" }}>
          <Box w={"56"} display={{ base: "none", md: "initial" }} pr={12}>
            <HomeAside data={data} />
          </Box>
          <Box flex={1}>
            <Flex justifyContent={"space-between"} mb={"6"} alignItems={"center"}>
              <Box display={{ base: "none", md: "inherit" }}>
                <HomeCurrentPage data={data} />
              </Box>
              <IconButton aria-label="Menu" variant={"unstyled"} icon={<HamburgerIcon />} minW={"min-content"} h={"min-content"} display={{ base: "initial", md: "none" }} onClick={controller.onOpen} />
              <HomeLanguage languages={languages} />
            </Flex>
            <HomeMainContent content={content} />
          </Box>
        </Flex>
        <Flex align={"center"} justify={"center"} direction={{base: "column", sm: "row"}} w={"full"} p={1} color={"black"} bgColor={"blackAlpha.200"} _dark={{ color: "white", bgColor: "blackAlpha.500" }}>
          <Text fontSize={"sm"} fontWeight={"medium"}>Innosec - {lang === 'en' ? 'System user manual' : 'Manual de utilização do sistema'}</Text>
          <Box fontSize={"xs"} pos={{base: "inherit", sm: "absolute"}} right={{sm: 2}}>{lang === 'en' ? 'Version' : 'Versão'} {projectVersion}</Box>
        </Flex>
      </Flex>
    </>
  );
}

export async function getStaticPaths() {
  const dataLang = allData.languages
  const data: any = allData.data

  const paths: any[] = []
  dataLang.map((lang: language) => data[lang.id].map((cont: section) => {
    return cont.content ? paths.push({ params: { page: [lang.id, cont.id] } }) : cont.routes?.map((sub: subsection) => paths.push({ params: { page: [lang.id, cont.id, sub.id] } }))
  }))

  return {
    paths: paths,
    fallback: "blocking"
  }
}

export async function getStaticProps(context: any) {
  const data: any = allData.data
  const dataLang: language[] = allData.languages
  
  const { params } = context
  
  const fs = require('fs');
  const path = require('path');
  
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');  
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const projectVersion: string = packageJson.version;  

  const _data_ = data[params.page[0]] || null
  const _content_ = params.page[2]
    ? data[params.page[0]]?.filter((s: section) => s.id === params.page[1])[0]?.routes?.filter((sub: subsection) => sub.id === params.page[2])[0]?.content
    : data[params.page[0]]?.filter((s: section) => s.id === params.page[1])[0]?.content || null

  const page = _data_?.filter((s: section) => s.id === params.page[1])[0]?.name || null
  const subpage = params.page[2] && _data_?.filter((s: section) => s.id === params.page[1])[0]?.routes?.filter((sub: subsection) => sub.id === params.page[2])[0]?.name || null

  if (!dataLang.find(e => e.id === params.page[0])) {
    return {
      redirect: {
        destination: `/pt-br/inicio`,
        permanent: false,
      }
    }
  }

  if (!page || params.page[2] && !subpage) {
    return {
      redirect: {
        destination: `/${params.page[0]}/inicio`,
        permanent: false,
      }
    }
  }
    
  return {
    props: {
      page: page,
      subpage: subpage,
      lang: params.page[0],
      data: _data_,
      content: _content_ || [],
      languages: dataLang,
      projectVersion: projectVersion
    }
  }
}