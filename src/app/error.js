"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


const ErrorBoundary = ({error, reset}) => {
  return (
    <div className="bg-zinc-900 w-full h-screen flex items-center justify-center">
      <Card className={"bg-zinc-900 m-2 w-full"}>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
            <p className="text-white mt-2 break-words">{error.message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => reset()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorBoundary