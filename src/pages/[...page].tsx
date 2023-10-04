// import { Inter } from "next/font/google";
import { Text, Flex, Box, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton, DrawerHeader, useDisclosure } from "@chakra-ui/react";
// import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { language, section, subsection } from "@/interfaces/contentProps";
import HomeHeader from "@/components/home/HomeHeader";
import HomeAside from "@/components/home/HomeAside";
import HomeCurrentPage from "@/components/home/HomeCurrentPage";
import HomeLanguage from "@/components/home/HomeLanguage";
import HomeMainContent from "@/components/home/HomeMainContent";
import { galleryItem, linkItem, textItem } from "@/interfaces/itensProps";
import allData from "../../public/allData.json";

interface InitialHomeProps {
  data: section[]
  content: (textItem | linkItem | galleryItem)[]
  languages: language[]
}

export default function InitialHome({ data, content, languages }: InitialHomeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        size={"xs"}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={"gray.100"} color={"black"} _dark={{ color: "white", bgColor: "gray.900" }}>
          <DrawerHeader>
            <HomeCurrentPage data={data} fontSize={"xs"} />
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody pl={"-2"} mt={2}>
            <HomeAside data={data} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex bgColor={"gray.100"} color={"black"} _dark={{ color: "white", bgColor: "gray.900" }} direction={"column"} minH={"100vh"} h={"full"} alignItems={"center"}>
        <HomeHeader data={data} />
        <Flex w={"full"} maxW={"1400px"} flex={1} py={8} pr={{ base: 4, sm: 8, md: 12 }} pl={{ base: 4, sm: 8, md: 12 }} overflow={{ base: "auto", md: "hidden" }}>
          <Box w={"56"} display={{ base: "none", md: "initial" }} pr={12}>
            <HomeAside data={data} />
          </Box>
          <Box flex={1}>
            <Flex justifyContent={"space-between"} mb={"8"} alignItems={"center"}>
              <Box display={{ base: "none", md: "inherit" }}>
                <HomeCurrentPage data={data} />
              </Box>
              <IconButton aria-label="Menu" variant={"unstyled"} icon={<HamburgerIcon />} minW={"min-content"} h={"min-content"} display={{ base: "initial", md: "none" }} onClick={onOpen} />
              <HomeLanguage languages={languages} />
            </Flex>
            <HomeMainContent content={content} />
          </Box>
        </Flex>
        <Flex align={"center"} justify={"center"} w={"full"} h={8} color={"black"} bgColor={"blackAlpha.200"} _dark={{ color: "white", bgColor: "blackAlpha.500" }}>
          <Text fontSize={"xs"} fontWeight={"medium"}>Innosec - Manual de utilização do sistema</Text>
        </Flex>
      </Flex>
    </>
  );
}

export async function getStaticPaths() {
  const dataLang = allData.languages
  const data: any = allData.data

  const paths: any[] = []
  dataLang.map((lang: language) => data[lang.id]?.map((cont: section) => {
    return cont.content ? paths.push({ params: { page: [lang.id, cont.id] } }) : cont.routes?.map((sub: subsection) => paths.push({ params: { page: [lang.id, cont.id, sub.id.split('_')[0]] } }))
  }))

  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps(context: any) {
  const data: any = allData.data
  const dataLang: any = allData.languages
  
  const { params } = context
  
  const _data_ = data[params.page[0]]
  const _content_ = params.page[2]
    ? data[params.page[0]].filter((s: section) => s.id === params.page[1])[0].routes?.filter((sub: subsection) => sub.id.split('_')[0] === params.page[2])[0]?.content
    : data[params.page[0]].filter((s: section) => s.id === params.page[1])[0]?.content

  return {
    props: {
      data: _data_,
      content: _content_ || [],
      languages: dataLang
    }
  }
}