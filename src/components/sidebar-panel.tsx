import {Box, Text} from '@primer/react'

export function SidebarPanel({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <Box sx={{p: 3}}>
      <Text as="h2" sx={{fontWeight: 'bold', fontSize: 2, m: 0, mb: 2, display: 'block'}}>
        {title}
      </Text>
      <Box>{children}</Box>
    </Box>
  )
}
