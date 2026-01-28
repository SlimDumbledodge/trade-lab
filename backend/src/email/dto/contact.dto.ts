import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class ContactDto {
    @IsString()
    @IsNotEmpty({ message: "Le prénom est requis" })
    @MinLength(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    @MaxLength(50, { message: "Le prénom est trop long" })
    firstName: string

    @IsString()
    @IsNotEmpty({ message: "Le nom est requis" })
    @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères" })
    @MaxLength(50, { message: "Le nom est trop long" })
    lastName: string

    @IsEmail({}, { message: "L'email doit être valide" })
    @IsNotEmpty({ message: "L'email est requis" })
    email: string

    @IsString()
    @IsNotEmpty({ message: "Le sujet est requis" })
    @MinLength(5, { message: "Le sujet doit contenir au moins 5 caractères" })
    @MaxLength(100, { message: "Le sujet est trop long" })
    subject: string

    @IsString()
    @IsNotEmpty({ message: "Le message est requis" })
    @MinLength(20, { message: "Le message doit contenir au moins 20 caractères" })
    @MaxLength(1000, { message: "Le message est trop long" })
    message: string
}
