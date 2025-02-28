/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styled from "styled-components";
import dayjs from "dayjs";
import { MoneyInput, MoneyLabel } from "../../styles/moneyInputStyles";
import { sumTotal } from "../../services/utils/sumTotal";

import { foodValidation } from "../../services/validationServices/foodValidation";
import {
  averageDateHour,
  ceilDateHour,
  floorDateHour,
} from "../../services/utils/dateServices";
import { intToMoney } from "../../services/utils/format";

export default function CreateLunchboxDialog({
  openDialog,
  handleCloseDialog,
  setItems,
  setTotal,
  setSnackbar,
  setSnackbarMessage,
  setSnackbarType,
  setLoading,
  setEmployees,
  employees,
  menu,
  setMenu,
  userData,
  EmployeesService,
  FoodControlService,
  employee,
  setEmployee,
  employeeError,
  setEmployeeError,
  typeError,
  setTypeError,
  type,
  setType,
  value,
  setValue,
  valueError,
  setValueError,
}) {
  const [date, setDate] = useState(dayjs(Date.now()));
  const today = ceilDateHour(new Date(Date.now()));
  const todayMinus5 = floorDateHour(new Date(Date.now() - 86400000 * 5));
  const filterString = `from=${todayMinus5}&to=${today}`;

  async function getData() {
    try {
      const employeesResp = await EmployeesService.getEmployees();
      const menuResp = await FoodControlService.getMenu(userData.token);
      setEmployees(employeesResp.data);
      setMenu(menuResp.data);
    } catch (error) {
      setSnackbar(true);
      setSnackbarType("error");
      setSnackbarMessage("Algo deu errado...");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    let selectedItem = type;
    if (selectedItem === "Outro") {
      selectedItem = {
        name: "Outro",
        id: 0,
        value: 0,
      };
    }
    const { errorObject, intValue } = foodValidation({
      employee,
      type: selectedItem,
      date,
      value,
    });

    if (
      errorObject.employee ||
      errorObject.type ||
      errorObject.value ||
      errorObject.date
    ) {
      setEmployeeError(errorObject.employee);
      setTypeError(errorObject.type);
      setValueError(errorObject.value);
      setSnackbar(true);
      setSnackbarType("error");
      setSnackbarMessage(
        "Seu pedido precisa de funcionário, item, valor e data válidos"
      );
      setLoading(false);
    } else {
      FoodControlService.createFoodOrder(
        {
          employee,
          type: selectedItem.name,
          value: intValue,
          date: averageDateHour(date),
          author: userData.name,
        },
        userData.token
      )
        .then(() => {
          setSnackbar(true);
          setSnackbarType("success");
          setSnackbarMessage("Pedido Registrado com sucesso");
          handleCloseDialog();
          setEmployee(0);
          setType(0);
          setValue("0,00");
          setDate(dayjs(Date.now()));
          FoodControlService.getFoodOrders(filterString, userData.token)
            .then((resp) => {
              setItems(resp.data);
              setTotal(sumTotal(resp.data));
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
              setSnackbar(true);
              setSnackbarType("error");
              setSnackbarMessage("Algo deu errado ao recuperar os pedidos");
            });
        })
        .catch(() => {
          setLoading(false);
          setSnackbar(true);
          setSnackbarType("error");
          setSnackbarMessage(
            "Algo deu errado ao tentar registrar o funcionário"
          );
        });
    }
  }

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Pedido de Marmita</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-select-employee"
            sx={{ mt: 1, mr: 1, mb: 1 }}
            select
            error={employeeError}
            fullWidth
            required
            label="Funcionário"
            defaultValue={0}
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
          >
            <MenuItem key={0} value={0} sx={{ fontSize: 15 }}>
              {"Escolha um funcionário"}
            </MenuItem>
            {employees.map((employee, index) => (
              <MenuItem key={index} value={employee.id} sx={{ fontSize: 15 }}>
                {employee.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-type"
            sx={{ mt: 1, mr: 1, mb: 5 }}
            select
            fullWidth
            error={typeError}
            required
            label="Opção"
            defaultValue={0}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setValue(intToMoney(e.target.value.value || 0));
              setValueError(false);
            }}
          >
            <MenuItem value={0} sx={{ fontSize: 15 }}>
              {"Escolha um tipo"}
            </MenuItem>
            {menu.map((item, index) => (
              <MenuItem key={index} value={item} sx={{ fontSize: 15 }}>
                {`${item.name} ${item.description}`}
              </MenuItem>
            ))}
            <MenuItem value={"Outro"} sx={{ fontSize: 15 }}>
              {"Outro"}
            </MenuItem>
          </TextField>
          <MoneyLabel>Valor*:</MoneyLabel>
          <MoneyInput
            id="input-value"
            name="input-value"
            placeholder="0,00"
            warning={valueError}
            disabled={type === "Outro" ? false : true}
            value={value}
            intlConfig={{ locale: "pt-BR", currency: "BRL" }}
            decimalScale={2}
            onValueChange={(value, name) => {
              setValue(value);
              setValueError(false);
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateWrapper>
              <DesktopDatePicker
                value={date}
                autoFocus
                margin="dense"
                label="Data"
                id="date"
                inputFormat="DD/MM/YYYY"
                type="date"
                required
                variant="standard"
                onChange={(e) => setDate(e)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ mt: 2 }} />
                )}
              />
            </DateWrapper>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit}>Registrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const DateWrapper = styled.div`
  margin-top: 10px;
`;
