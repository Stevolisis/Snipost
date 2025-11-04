import { sendGAEvent } from '@next/third-parties/google'

export const trackEvent = (action, parameters = {}) => {
  sendGAEvent('event', action, parameters)
}

// Specific event helpers using @next/third-parties
export const trackCodePublished = (title, language) => {
  sendGAEvent('event', 'code_published', {
    category: 'snippet',
    label: title,
    language: language,
    value: 1
  })
}

export const trackUpvote = (title) => {
  sendGAEvent('event', 'upvotes', {
    category: 'engagement', 
    label: title,
    value: 1
  })
}

export const trackDownvote = (title) => {
  sendGAEvent('event', 'downvotes', {
    category: 'engagement', 
    label: title,
    value: 1
  })
}

export const trackFollow = (name) => {
  sendGAEvent('event', 'follows', {
    category: 'engagement', 
    label: name,
    value: 1
  })
}
export const trackUnfollow = (name) => {
  sendGAEvent('event', 'unfollows', {
    category: 'engagement', 
    label: name,
    value: 1
  })
}

export const trackComment = (title) => {
  sendGAEvent('event', 'comments', {
    category: 'engagement',
    label: title,
    value: 1
  })
}

export const trackReplies = (title) => {
  sendGAEvent('event', 'replies', {
    category: 'engagement',
    label: title,
    value: 1
  })
}

export const trackFork = (title) => {
  sendGAEvent('event', 'forks', {
    category: 'engagement',
    label: title, 
    value: 1
  })
}

export const trackTip = (title, amount) => {
  sendGAEvent('event', 'tip', {
    category: 'monetization',
    label: title,
    value: amount
  })
}

export const trackCompanySignup = (companyName) => {
  sendGAEvent('event', 'company_signup', {
    category: 'conversion',
    label: companyName,
    value: 1
  })
}

export const trackDocsCreated = (company, docType, title) => {
  sendGAEvent('event', 'docs_created', {
    category: 'content',
    label: title,
    company: company,
    doc_type: docType,
    value: 1
  })
}

export const trackUpdatesCreated = (company, title) => {
  sendGAEvent('event', 'update_created', {
    category: 'content',
    label: title,
    company: company,
    value: 1
  })
}

