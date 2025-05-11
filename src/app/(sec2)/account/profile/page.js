"use client"
import React, { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MultiSelect } from '@/components/appComponents/MultiSelect'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { updateUserData } from '@/lib/redux/slices/auth'

const frameworksList = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'solana', label: 'Solana' },
  { value: 'web3', label: 'Web3' },
  { value: 'javascript', label: 'JavaScript' },
  // Add more tags as needed
]

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { userData, jwtToken } = useAppSelector((state) => state.auth)
  const [formValues, setFormValues] = useState({
    name: '',
    userName: '',
    email: '',
    position: '',
    about: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [tags, setTags] = useState([])

  // Load user data
  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || '',
        userName: userData.userName || '',
        email: userData.email || '',
        position: userData.position || '',
        about: userData.about || ''
      })
      
      // Initialize tags if user has followed tags
      if (userData.followedTags) {
        setTags(userData.followedTags.map(tag => ({
          value: tag,
          label: frameworksList.find(f => f.value === tag)?.label || tag
        })))
      }
    }
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    
    // Append all fields
    formData.append('name', formValues.name)
    formData.append('userName', formValues.userName)
    formData.append('email', formValues.email)
    formData.append('position', formValues.position)
    formData.append('about', formValues.about)
    
    // Append tags as JSON array
    if (tags.length > 0) {
      formData.append('followedTags', JSON.stringify(tags.map(tag => tag.value)))
    }
    
    // Append file if selected
    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      dispatch(updateUserData(data.user))
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      alert(error.message)
    }
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <form 
        className='w-[93%] md:w-[50%] flex flex-col gap-y-5 md:gap-y-8'
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Avatar</Label>
          <Input 
            type="file" 
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Name</Label>
          <Input 
            type="text" 
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="John Doe" 
            required
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">UserName</Label>
          <Input 
            type="text" 
            name="userName"
            value={formValues.userName}
            onChange={handleChange}
            placeholder="JohnDev" 
            required
          />
        </div>
        
        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Email</Label>
          <Input 
            type="email" 
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="john@gmail.com" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Position</Label>
          <Input 
            type="text" 
            name="position"
            value={formValues.position}
            onChange={handleChange}
            placeholder="Software Engineer" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">About</Label>
          <Textarea
            name="about"
            value={formValues.about}
            onChange={handleChange}
            placeholder="I'm a full stack developer for over 9 years ..."
            className="h-48"
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Followed Tags</Label>
          <div className="">
            <MultiSelect
              options={frameworksList}
              onValueChange={setTags}
              defaultValue={tags}
              placeholder="Select Tag"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
          </div>
        </div>

        <Button type="submit">Complete profile</Button>
      </form>
    </div>
  )
}

export default ProfilePage