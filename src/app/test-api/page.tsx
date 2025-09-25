'use client'

import { useState } from 'react'
import { Box, Button, Card, Code, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { Rocket, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TestApiPage() {
  const [apiUrl, setApiUrl] = useState('/api/transcripts?pageNum=1')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const testApiCall = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStatus(null)

    try {
      console.log('🚀 Making API request to:', apiUrl)
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      setStatus(res.status)
      
      const contentType = res.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      console.log('📦 Response:', { status: res.status, data })

      if (!res.ok) {
        setError(`API Error (${res.status}): ${res.statusText}`)
      }
      
      setResponse(data)
    } catch (err) {
      console.error('❌ API Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (!status) return 'gray'
    if (status >= 200 && status < 300) return 'green'
    if (status >= 400 && status < 500) return 'orange'
    return 'red'
  }

  const getStatusIcon = () => {
    if (!status) return null
    if (status >= 200 && status < 300) {
      return <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--green-9)' }} />
    }
    return <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--red-9)' }} />
  }

  return (
    <Box p="6">
      <Heading size="8" mb="2">API Authentication Test</Heading>
      <Text size="3" color="gray" mb="6">
        Test authenticated API requests to verify cookie-based authentication is working
      </Text>

      <Card size="3" variant="surface" mb="4">
        <Flex direction="column" gap="4">
          <Box>
            <Text size="2" weight="medium" mb="2">API Endpoint</Text>
            <Flex gap="2">
              <TextField.Root
                size="3"
                placeholder="/api/transcripts?pageNum=1"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button 
                size="3" 
                onClick={testApiCall} 
                disabled={loading || !apiUrl}
                variant={loading ? 'soft' : 'solid'}
              >
                {loading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Rocket style={{ width: '16px', height: '16px' }} />
                    Test API
                  </>
                )}
              </Button>
            </Flex>
          </Box>

          <Flex gap="2" wrap="wrap">
            <Button size="2" variant="soft" onClick={() => setApiUrl('/api/transcripts?pageNum=1')}>
              Transcripts
            </Button>
            <Button size="2" variant="soft" onClick={() => setApiUrl('/api/auth/session')}>
              Session
            </Button>
            <Button size="2" variant="soft" onClick={() => setApiUrl('/api/analytics/overview')}>
              Analytics
            </Button>
            <Button size="2" variant="soft" onClick={() => setApiUrl('/api/users/current')}>
              Current User
            </Button>
          </Flex>
        </Flex>
      </Card>

      {status && (
        <Card size="3" variant="surface" mb="4">
          <Flex align="center" gap="2">
            {getStatusIcon()}
            <Text size="3" weight="medium" color={getStatusColor()}>
              Status: {status}
            </Text>
          </Flex>
        </Card>
      )}

      {error && (
        <Card size="3" variant="surface" style={{ borderColor: 'var(--red-6)' }} mb="4">
          <Flex align="center" gap="2">
            <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--red-9)' }} />
            <Text size="3" color="red" weight="medium">
              Error: {error}
            </Text>
          </Flex>
        </Card>
      )}

      {response && (
        <Card size="3" variant="surface">
          <Box>
            <Text size="2" weight="medium" mb="2">Response</Text>
            <Code 
              size="2" 
              style={{ 
                display: 'block', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'var(--gray-2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-2)',
                maxHeight: '500px',
                overflowY: 'auto'
              }}
            >
              {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
            </Code>
          </Box>
        </Card>
      )}

      <Card size="2" variant="ghost" mt="6">
        <Text size="2" color="gray">
          <strong>Test Instructions:</strong>
          <br />
          1. Login with legacy authentication mode (NEXT_PUBLIC_AUTH_MODE=legacy)
          <br />
          2. Click "Test API" to make an authenticated request
          <br />
          3. A successful response (Status 200) indicates cookies are working
          <br />
          4. A 401 error indicates authentication cookies are not being sent/recognized
        </Text>
      </Card>
    </Box>
  )
}