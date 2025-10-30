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
                <a
                  href="mailto:snipost62@gmail.com?subject=Feedback%20or%20Complaint"
                  className="mt-4 inline-block"
                >
                  <Button variant="default" className="w-full">Email Us</Button>
                </a>
            </CardHeader>
        </Card>
    </div>
  )
}

export default page