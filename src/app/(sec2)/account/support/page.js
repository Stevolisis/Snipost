import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <div className='py-2 px-12 flex justify-center items-center h-[80%]'>
        <Card className="w-full max-w-[400px]">
            <CardHeader>
                <CardTitle>For Feeback or Complaints</CardTitle>
                <CardDescription>Reach out to us here </CardDescription>
                <Button variant="default">Whatsapp</Button>
            </CardHeader>
        </Card>
    </div>
  )
}

export default page