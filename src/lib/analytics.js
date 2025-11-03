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
  sendGAEvent('event', 'upvote', {
    category: 'engagement', 
    label: title,
    value: 1
  })
}

export const trackComment = (title) => {
  sendGAEvent('event', 'comment', {
    category: 'engagement',
    label: title,
    value: 1
  })
}

export const trackFork = (title) => {
  sendGAEvent('event', 'fork', {
    category: 'engagement',
    label: title, 
    value: 1
  })
}

export const trackCompanySignup = (companyName) => {
  sendGAEvent('event', 'company_signup', {
    category: 'conversion',
    label: companyName,
    value: 1
  })
}

export const trackDocsCreated = (docType, title) => {
  sendGAEvent('event', 'docs_created', {
    category: 'content',
    label: title,
    doc_type: docType,
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
