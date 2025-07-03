import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import FormContainer from "./form/FormContainer";
import { SubmitButton } from "./form/Buttons";
import { createDateReservation } from "@/utils/actions";

export default function UserCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const currentDate = new Date();

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(undefined); // Resetuj godzinę po zmianie dnia
    };
    const dateString = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined;
    const timeString = selectedTime;

    const createReservation = createDateReservation.bind(null, {
        date: dateString!,
        time: timeString!,
    });

    return (
        <div className={cn("flex flex-col md:flex-row w-full h-full")}>

            {/* Kalendarz - zajmuje całą lewą kolumnę */}
            <div className="flex justify-center w-full md:w-1/2 p-4 ">
                <DayPicker
                    mode="single"
                    weekStartsOn={1}
                    disabled={(date) => date.getDay() === 0 || date < currentDate} // Blokowanie niedziel i dat wcześniejszych
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
                        disabled: "text-gray-400 cursor-not-allowed", // Zmiana koloru dla niedostępnych dni
                    }}
                    modifiers={{
                        disabled: (date) => date.getDay() === 0 || date < currentDate, // Definicja niedostępnych dni
                    }}
                    showOutsideDays={true}
                    selected={selectedDate}
                    onDayClick={handleDayClick}
                    defaultMonth={currentDate}

                />
            </div>

            {/* Wybór godziny - zawsze widoczny */}
            <div className="relative flex flex-col items-center w-full md:w-1/2 p-4 border-l-0 md:border-l-2 border-gray-300 mb-3 ">
                <h3 className="text-lg font-bold text-center mb-4">
                    Wybrana data: {selectedDate ? selectedDate.toLocaleDateString() : "Wybierz dzień"}
                    {selectedTime && `, godzina: ${selectedTime}`}
                </h3>

                <label className="mb-2 text-gray-700">Wybierz godzinę:</label>
                <ul className="relative grid grid-cols-1 gap-2 w-5/12">
                    {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                        <li key={time}>
                            <button
                                className={`w-full p-2 border rounded-lg transition ${selectedTime === time ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"
                                    }`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        </li>
                    ))}
                </ul>
                {selectedDate && selectedTime && (
                    <FormContainer action={createReservation}>
                        <SubmitButton text='Reserve' className='w-full' />
                    </FormContainer>
                )}
            </div>
        </div>
    );
}

