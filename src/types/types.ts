// Interface for the users table
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string,
    lastName: string
}

// Interface for the professional_profiles table
export interface ProfessionalProfile {
    id: number;
    profession: string;
    specialty: string;
    experience: string;
    userId: number; // Foreign key referencing users(id)
}

// Interface for the study_cases table
export interface StudyCase {
    id: string;
    title: string;
    description: string;
    content: string;
    createdAt: Date;
    userId: number;

}

export interface StudyCaseInput {
    title: string;
    description?: string;
  }

  export interface UpdateStudyCaseInput {
    id: string;
    title?: string;
    description?: string;
  }

// Interface for the roles table
/* export interface Role {
    id: number;
    name: string;
} */


export interface Collaborator {
    id: number;
    userId: number;
    studyCaseId: number;
    //role_id: number;
}


export interface Document {
    id: number;
    name: string;
    content?: string | null;
    contentType?: string | null;
    studyCaseId: number; // Foreign key referencing study_cases(id)
}

// Interface for the chats table
export interface Chat {
    id: number;
    studyCaseId: number; // Foreign key referencing study_cases(id)
}

// Interface for the messages table
export interface Message {
    id: number;
    content: string;
    studyId: number;
    type: number;
    createdAt: Date;
}

// Interface for the invitations table
export interface Invitation {
    id: number;
    status: string; // CHAR(1) NOT NULL
    senderId: number; // Foreign key referencing users(id)
    receiverId: number; // Foreign key referencing users(id)
}
