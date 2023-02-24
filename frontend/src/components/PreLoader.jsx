import { Box, Text, Spinner } from '@chakra-ui/react'
import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../UserContext';
function PreLoader({ setLoading }) {
    const [notAvailable, setNotAvailable] = useState(false)
    const [, setToken, ] = useContext(UserContext)
    const fetchHealth = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api`)
        .then(response => {
            if (response.ok) {
                setLoading(false)
            }
            else {
                setNotAvailable(true)
            }
        }).catch(e => setNotAvailable(true))
    }
    useEffect(() => {
        fetchHealth()
        const checkHealth = setInterval(() => {
            fetchHealth()
            setToken(null)
            localStorage.clear()
        }, 5000)
        return () => clearInterval(checkHealth)
    }, [])
  return (
    <Box textAlign="center">
    {notAvailable &&
    <>
    <Text fontSize="3xl" marginTop={10}>Cервер не доступен :(  </Text>
    <Text fontSize="xl">Ведутся <Text as="span" color="green.300">технические работы</Text></Text>
    </>
    }
    <Spinner size="xl" marginTop={20} thickness='4px' speed='0.7s' emptyColor='whiteAlpha.100' color='green.300' />
    </Box>
  )
}

export default PreLoader
