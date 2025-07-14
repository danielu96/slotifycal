"use client";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import FormContainer from "./form/FormContainer";
import { SubmitButton } from "./form/Buttons";
import { createDateReservation } from "@/utils/actions";
import { useToast } from "@/components/hooks/use-toast";
import { useCalendarStore } from '@/utils/store';
import { groupReservationsByDate } from "@/utils/calendar";
const pad2 = (n: number) => n.toString().padStart(2, "0");


export default function UserCalendar() {
    const { toast } = useToast();
    const router = useRouter();

    // UI state
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>();

    // Today @ midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reservations store + helper map
    const reservations = useCalendarStore((s) => s.reservations);
    const setReservations = useCalendarStore((s) => s.setReservations);
    const reservedMap = groupReservationsByDate(reservations);

    // All slots
    const allSlots = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00",
    ];

    // Helpers
    const isTimeDisabled = (dateKey: string, time: string) =>
        (reservedMap[dateKey] || []).includes(time);

    const isDayFullyBooked = (day: Date) => {
        const d = new Date(day);
        d.setHours(0, 0, 0, 0);
        const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
        return (reservedMap[key]?.length || 0) >= allSlots.length;
    };

    // Day click handler
    const handleDayClick = (day: Date) => {
        const d = new Date(day);
        d.setHours(0, 0, 0, 0);

        if (d < today) {
            toast({ description: "Nie możesz wybrać daty z przeszłości." });
            return;
        }
        if ([0, 6].includes(d.getDay())) {
            toast({ description: "Weekend jest niedostępny." });
            return;
        }
        if (isDayFullyBooked(d)) {
            const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
            toast({
                description: `Brak wolnych godzin (${reservedMap[key].join(", ")}) tego dnia.`,
            });
            return;
        }

        setSelectedDate(d);
        setSelectedTime(undefined);
    };

    const dateString = selectedDate
        ? `${selectedDate.getFullYear()}-${pad2(selectedDate.getMonth() + 1)}-${pad2(selectedDate.getDate())}`
        : undefined;

    const handleCreate = async (): Promise<{ message: string }> => {
        if (!dateString || !selectedTime) {
            return { message: "Musisz wybrać datę i godzinę." };
        }
        const newRes = await createDateReservation({
            date: dateString,
            time: selectedTime,
        });
        reservations;
        toast({
            title: "Sukces",
            description: "Rezerwacja utworzona pomyślnie.",
        });
        router.push("/reservations");
        return { message: "OK" };
    };

    return (
        <div className={cn("flex flex-col md:flex-row w-full h-full")}>
            {/* — KALENDARZ — */}
            <div className="flex justify-center w-full md:w-1/2 p-4">
                <DayPicker
                    mode="single"
                    weekStartsOn={1}
                    showOutsideDays
                    selected={selectedDate}
                    onDayClick={handleDayClick}
                    modifiers={{
                        disabled: (day) =>
                            day < today ||
                            [0, 6].includes(day.getDay()) ||
                            isDayFullyBooked(day),
                    }}

                    modifiersClassNames={{
                        disabled:
                            "text-gray-400 cursor-not-allowed " +
                            'hover:after:content-["Zajęte"] ' +
                            "hover:after:absolute " +
                            "hover:after:-top-6 hover:after:left-1/2 hover:after:-translate-x-1/2 " +
                            "hover:after:bg-black hover:after:text-white hover:after:text-xs " +
                            "hover:after:px-2 hover:after:py-1 hover:after:rounded " +
                            "hover:after:whitespace-nowrap hover:after:shadow-lg"
                    }}

                    // 4) podstawowe classNames
                    classNames={{
                        root: "relative flex justify-center min-h-[480px] p-4 ",
                        nav: "flex items-center justify-between gap-2",
                        month_caption: "text-lg font-bold text-blue-600 flex-grow text-center -mt-10 mb-6",
                        day: "relative p-3 md:p-4",
                        month: "p-4 justify-center items-center",
                        today: "bg-red-500 text-white font-bold rounded-full",
                        selected: "bg-blue-500 border-amber-500 text-white rounded-full",
                        table: "justify-center items-center text-center w-full ",
                        weeks: "justify-center items-center text-center w-full h-full",
                        day_disabled: " cursor-not-allowed", // Styl dla zablokowanych dni
                    }}
                    defaultMonth={today}
                />
            </div>

            {/* — WYBÓR GODZINY — */}
            <div className="flex flex-col items-center w-full md:w-1/2 p-4 border-l-2 border-gray-300">
                <h3 className="text-lg font-bold mb-4 text-center">
                    Wybrana data:{" "}
                    {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Wybierz dzień"}
                    {selectedTime && `, godzina: ${selectedTime}`}
                </h3>

                <label className="mb-2">Wybierz godzinę:</label>
                <ul className="grid grid-cols-1 gap-2 max-w-xs w-full">
                    {allSlots.map((time) => {
                        const disabled =
                            !selectedDate ||
                            isTimeDisabled(dateString!, time);

                        return (
                            <li key={time}>
                                <button
                                    onClick={() => setSelectedTime(time)}
                                    disabled={disabled}
                                    className={cn(
                                        "w-full p-2 border rounded transition",
                                        disabled
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : selectedTime === time
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-blue-500 hover:text-white"
                                    )}
                                >
                                    {time}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {selectedDate && selectedTime && (
                    <FormContainer action={handleCreate}>
                        <SubmitButton text="Reserve" className="w-full mt-4" />
                    </FormContainer>
                )}
            </div>
        </div>
    );
}

