import * as z from 'zod'

export const userCredSchema = z.object({
	uuid: z.string(),
	username: z.string(),
	password: z.string()
})
export type UserCredentials = z.infer<typeof userCredSchema>

export const loginCredSchema = userCredSchema.omit({ uuid: true })
export type LoginCredentials = z.infer<typeof loginCredSchema>

export type TokenResponse = {
	jwt: string;
}


export type JwtPayload = {
	uuid: string;
}


export type Book = {
	id: string;
	title: string;
	author: string;
	borrowStatus: string;
}

