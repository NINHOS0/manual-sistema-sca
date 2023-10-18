import { galleryItem, linkItem, listItem, textItem } from "@/interfaces/itensProps"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Grid, Image, Link, ListItem, OrderedList, Stack, Text, UnorderedList } from "@chakra-ui/react"

interface HomeMainItemProps {
  item: (textItem | linkItem | galleryItem | listItem)
  handleOpenLighbox: (src: string) => void
}

export default function HomeMainItem({ item, handleOpenLighbox }: HomeMainItemProps) {
  
  return (
    <>
      {
      item.type === "text"
      ? <Text fontSize={item.fontSize} fontWeight={item.fontWeight}>{item.value}</Text>
      : item.type === "link"
      ? <Link display={"inline-flex"} alignItems={"center"} gap={"1"} color={"blue.500"} w={'fit-content'} fontSize={item.fontSize} fontWeight={item.fontWeight} href={`${item.url}`}><ExternalLinkIcon boxSize={'3.5'} />{item.value}</Link>
      : item.type === "gallery"
      ? (
        <Grid templateColumns={{base: '1fr', lg: `repeat(${item.images.length <= 1 ? '1' : 2}, 1fr)`}} justifyItems={{base: 'center', lg: 'baseline'}} gap={2} mt={1} mb={4} px={1}>
          {item.images.map((img, i) => (
            <Stack gap={0.5} key={i}>
              <Text fontSize={'xs'} color={'gray.400'}>{img.alt}</Text>
              <Image boxShadow={"xl"} _dark={{boxShadow: 'none'}} cursor={'pointer'} src={`/img/${img.src}`} onClick={() => handleOpenLighbox(`/img/${img.src}`)} alt={img.alt} w={'full'} maxW={750} borderRadius={"lg"} />
            </Stack>
          ))}
        </Grid>
      )
      : item.type === 'list' && (
        <>
          {item.style === "number" ? (
            <OrderedList stylePosition={"inside"}>
              {item.list.map((list, i) => <ListItem key={i} textAlign={'start'}><b>{list.title}</b> {list.text && list.text}</ListItem>)}
            </OrderedList>
          ) : (
            <UnorderedList stylePosition={"inside"}>
              {item.list.map((list, i) => <ListItem key={i} textAlign={'start'}><b>{list.title}</b> {list.text && list.text}</ListItem>)}
            </UnorderedList>
          )}
        </>
      )}
    </>
  )
}