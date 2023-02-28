import dayjs from "dayjs"
import WorkDay from "./WorkDay"
import { areDatesFromSameDay } from "./helpers";
import { PunchCardContainer } from "./styles";
import { useEffect, useState } from "react";
import WorkDayDialog from "./WorkDayDialog";

// Se um employee tem dois registros de presença em um mesmo dia, a aplicação só pega o primeiro deles e ignora completamente o resto
// das presenças, mesmo aquelas que não tenham duplicatas, isso por que não é esperado que um trabalhador tenha trabalhado ao mesmo tempo em dois lugares

export default function PunchCard({ employeeData }) {
    const [ dialogConfig, setDialogConfig ] = useState({
        shouldOpen: false,
        workDayData: {}
    })
    const renderDotsAmount = 232;
    const stepX = 24;
    const stepY = 24;
    const padding = 10

    useEffect(() => {console.log(employeeData["employees_worked_days"].length)}, [employeeData])

    function* generatePunchCard() {
        const todayDate = dayjs();
        const registeredPresences = employeeData["employees_worked_days"]
        let employeeWorkedDaysCurrentIndex = 0;
    
        for(let i = 0; i < renderDotsAmount; i++) {
            const iDate = todayDate.subtract(i, "day")
    
            if (
                employeeWorkedDaysCurrentIndex < registeredPresences.length 
                && areDatesFromSameDay(registeredPresences[employeeWorkedDaysCurrentIndex].date, iDate)
            ) {
                yield registeredPresences[employeeWorkedDaysCurrentIndex]
                employeeWorkedDaysCurrentIndex += 1
            } else yield { date: iDate.toISOString() }
        }
    }

    function* calculateRectCoordinates() {
        let punchCardGenerator = generatePunchCard();
        let lastCalculatedY;
        let lastCalculatedX;

        for(let i = 0; i < renderDotsAmount; i++) {
            const currentWorkDay = punchCardGenerator.next().value
            const weekDay = dayjs(currentWorkDay.date).day();

            if(lastCalculatedY === undefined) {
                lastCalculatedY = (stepY*weekDay)+padding;
                lastCalculatedX = 30;

            } else {
                const lastWeekDay = 6

                if((lastCalculatedY-stepY) < padding) {
                    lastCalculatedX += stepX;
                    lastCalculatedY = (lastWeekDay*stepY)+padding
                } else { lastCalculatedY -= stepY }
            }

            const currentWorkDayWithRectCoordinates = {
                ...currentWorkDay,
                rectX: lastCalculatedX,
                rectY: lastCalculatedY
            }
            yield currentWorkDayWithRectCoordinates;
        }
    }

    return (
        <PunchCardContainer viewBox={`0 0 820 200`}>
            <text x="0" y='24'>Dom</text>
            <text x="0" y='96'>Qua</text>
            <text x="0" y='168'>Sáb</text>
            {
               [...calculateRectCoordinates()]
                    .map(workedDay => <WorkDay key={workedDay.date} 
                                               workedDayData={workedDay} 
                                               dispatchDialog={() => {setDialogConfig({ shouldOpen: true, workDayData: workedDay })}} />)
            }
            <WorkDayDialog 
                openDialog={dialogConfig.shouldOpen}
                closeDialog={() => {setDialogConfig(prev => ({ ...prev, shouldOpen: false, workDayData: {} }))}}
                initialWorkDayData={dialogConfig.workDayData}
                employeeData={{ id: employeeData.id, name: employeeData.name }}
            />
        </PunchCardContainer>
    )
}