"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { isSameDay } from "date-fns";

import { cn } from "@/lib/utils";
import FormContainer from "./form/FormContainer";
import { SubmitButton } from "./form/Buttons";
import { createDateReservation } from "@/utils/actions";
import { useToast } from "@/components/hooks/use-toast";
import { useProperty } from "@/utils/store";
import { extractBlockedDates } from "@/utils/calendar";

const pad2 = (n: number) => n.toString().padStart(2, "0");

export default function UserCalendar() {
    const { toast } = useToast();
    const router = useRouter();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // stan UI
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>();

    // stan aplikacji
    const reservations = useProperty((s) => s.reservations);
    const addReservation = useProperty((s) => s.addReservation);

    // tablica zarezerwowanych dni (00:00 lokalnie)
    const blockedArr = extractBlockedDates(reservations).map((d) => {
        d.setHours(0, 0, 0, 0);
        return d;
    });

    // pomocnik: czy dzień ma być zablokowany?
    const isDayDisabled = (day: Date) => {
        const d = new Date(day);
        d.setHours(0, 0, 0, 0);

        if (d < today) return true;               // przeszłe dni
        if ([0, 6].includes(d.getDay())) return true; // weekend
        if (blockedArr.some((b) => isSameDay(b, d))) return true; // już zarezerwowany

        return false;
    };

    // buduje "YYYY-MM-DD" z lokalnej daty
    const dateString = selectedDate
        ? `${selectedDate.getFullYear()}-${pad2(selectedDate.getMonth() + 1)}-${pad2(
            selectedDate.getDate()
        )}`
        : undefined;

    const handleDayClick = (day: Date) => {
        if (isDayDisabled(day)) {
            toast({
                description:
                    day < today
                        ? "Nie możesz wybrać daty z przeszłości."
                        : [0, 6].includes(day.getDay())
                            ? "Weekend jest niedostępny."
                            : `Ten dzień jest już zarezerwowany.`,
            });
            return;
        }
        setSelectedDate(day);
        setSelectedTime(undefined);
    };

    const handleCreate = async (): Promise<{ message: string }> => {
        if (!dateString || !selectedTime) {
            return { message: "Musisz wybrać datę i godzinę." };
        }

        // 1) utworzenie rezerwacji na serwerze
        const newRes = await createDateReservation({
            date: dateString,
            time: selectedTime,
        });

        // 2) dorzuć do store
        addReservation(newRes);

        // 3) pokaż toast
        toast({
            title: "Sukces",
            description: "Rezerwacja utworzona pomyślnie.",
        });

        // 4) przekieruj
        router.push("/reservations");

        return { message: "OK" };
    };

    return (
        <div className={cn("flex flex-col md:flex-row w-full h-full")}>
            {/* KALENDARZ */}
            <div className="flex justify-center w-full md:w-1/2 p-4">
                <DayPicker
                    mode="single"
                    weekStartsOn={1}
                    showOutsideDays
                    selected={selectedDate}
                    onDayClick={handleDayClick}
                    disabled={isDayDisabled}
                    classNames={{
                        root: "relative flex justify-center min-h-[480px] p-4 ",
                        nav: "flex items-center justify-between gap-2",
                        month_caption: "text-lg font-bold text-blue-600 flex-grow text-center -mt-10 mb-6",
                        day: "p-3 md:p-4",
                        month: "p-4 justify-center items-center",
                        today: "bg-red-500 text-white font-bold rounded-full",
                        selected: "bg-blue-500 border-amber-500 text-white rounded-full",
                        table: "justify-center items-center text-center w-full ",
                        weeks: "justify-center items-center text-center w-full h-full",
                        day_disabled: " cursor-not-allowed", // Styl dla zablokowanych dni
                    }}

                    modifiersClassNames={{
                        disabled: "text-gray-400 cursor-not-allowed",
                    }}
                    defaultMonth={today}
                />
            </div>

            {/* WYBÓR GODZINY */}
            <div className="flex flex-col items-center w-full md:w-1/2 p-4 border-l-2 border-gray-300">
                <h3 className="text-lg font-bold mb-4 text-center">
                    Wybrana data:{" "}
                    {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Wybierz dzień"}
                    {selectedTime && `, godzina: ${selectedTime}`}
                </h3>

                <label className="mb-2">Wybierz godzinę:</label>
                <ul className="relative grid grid-cols-1 gap-2 w-5/12">
                    {[
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",

                    ].map((time) => (
                        <li key={time}>
                            <button
                                onClick={() => setSelectedTime(time)}
                                disabled={!selectedDate}
                                className={`w-full p-2 border rounded transition 
                  ${!selectedDate
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : selectedTime === time
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-500 hover:text-white"
                                    }`}
                            >
                                {time}
                            </button>
                        </li>
                    ))}
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


