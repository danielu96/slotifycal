export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;


export type Reservation = import("@prisma/client").Reservation;