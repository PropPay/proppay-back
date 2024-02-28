export const generateOTP = () => {
    // Définir la longueur de l'OTP
    const otpLength = 6;

    // Générer un nombre aléatoire avec la longueur souhaitée
    const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * (Math.pow(10, otpLength) - Math.pow(10, otpLength - 1)));

    // Retourner l'OTP sous forme de chaîne de caractères
    return otp.toString();
}