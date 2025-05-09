"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


const ErrorBoundary = ({error, reset}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className={"m-2 w-full"}>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
            <p className="mt-2 text-foreground  break-words">{error.message}</p>
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