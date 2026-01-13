export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  country: string
  education_level: string
  career_stage: string
  field_of_study: string
  role_type: 'student' | 'entrepreneur'
  payment_status: 'pending' | 'paid' | 'failed'
  payment_intent_id?: string
  stripe_customer_id?: string
  application_status: 'pending' | 'accepted' | 'rejected' | 'waitlisted'
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  document_type: 'cv' | 'passport' | 'certificate' | 'motivation_essay'
  file_url: string
  file_name: string
  file_size: number
  uploaded_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  location: string
  is_active: boolean
  created_at: string
}

export interface EventRegistration {
  id: string
  user_id: string
  event_id: string
  registration_status: 'registered' | 'cancelled' | 'attended'
  registered_at: string
}

export interface RegistrationFormData {
  email: string
  firstName: string
  lastName: string
  country: string
  educationLevel: string
  careerStage: string
  fieldOfStudy: string
  roleType: 'student' | 'entrepreneur'
}
