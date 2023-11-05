import React, {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import NetInfo from '@react-native-community/netinfo'

const ConnectionContext = createContext<{
  isConnected: boolean | null
} | null>(null)

export const useConnectionContext = () => {
  const value = useContext(ConnectionContext)

  if (!value) {
    throw new Error(
      'useConnectionContext must be wrapped inside <ConnectionProvider/>',
    )
  }

  return value
}

const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true)
  useEffect(() => {
    const unsubs = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)
    })

    return () => {
      unsubs()
    }
  }, [])

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export default ConnectionProvider
