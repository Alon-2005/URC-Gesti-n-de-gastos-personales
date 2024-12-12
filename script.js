// Variables globales
let initialMoney = 0; // Dinero inicial
let totalBalance = 0; // Balance total actual
let totalSavings = 0; // Total ahorrado

// Actualizar balance
document.getElementById('update-balance').addEventListener('click', () => {
  const initialInput = parseFloat(document.getElementById('initial-money').value) || 0;
  const incomeInput = parseFloat(document.getElementById('income').value) || 0;
  const depositInput = parseFloat(document.getElementById('deposit').value) || 0;

  // Calcular el balance total
  initialMoney = initialInput; // Guardar el dinero inicial
  totalBalance = initialMoney + incomeInput + depositInput; // Sumar ingresos y depósitos

  // Mostrar en la interfaz
  document.getElementById('initial-display').textContent = initialMoney.toFixed(2);
  document.getElementById('current-display').textContent = totalBalance.toFixed(2);
});

// Calcular y actualizar ahorro
document.getElementById('update-savings').addEventListener('click', () => {
  const savingsPercentage = parseFloat(document.getElementById('savings-percentage').value) || 0;

  if (savingsPercentage < 0 || savingsPercentage > 100) {
    alert('Por favor, ingrese un porcentaje válido (0-100).');
    return;
  }

  // Calcular ahorro basado en el balance total
  totalSavings = (savingsPercentage / 100) * totalBalance;

  // Mostrar en la interfaz
  document.getElementById('savings-total').textContent = totalSavings.toFixed(2);
});

// Registrar gasto
document.getElementById('add-expense').addEventListener('click', () => {
  const expenseDate = document.getElementById('expense-date').value;
  const expenseDescription = document.getElementById('expense-description').value;
  const expenseAmount = parseFloat(document.getElementById('expense-amount').value) || 0;

  // Validaciones
  if (!expenseDate || !expenseDescription || expenseAmount <= 0) {
    alert('Por favor, complete todos los campos correctamente.');
    return;
  }

  if (expenseAmount > totalBalance - totalSavings) {
    alert('No tienes suficiente saldo disponible después de ahorrar.');
    return;
  }

  // Actualizar balance
  totalBalance -= expenseAmount;

  // Mostrar balance actualizado
  document.getElementById('current-display').textContent = totalBalance.toFixed(2);

  // Agregar gasto a la tabla
  const tableBody = document.querySelector('#expense-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${expenseDate}</td>
    <td>${expenseDescription}</td>
    <td>$${expenseAmount.toFixed(2)}</td>
  `;
  tableBody.appendChild(newRow);

  // Limpiar campos del formulario de gastos
  document.getElementById('expense-date').value = '';
  document.getElementById('expense-description').value = '';
  document.getElementById('expense-amount').value = '';
});

// Descargar PDF
document.getElementById('download-pdf').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título del PDF
  doc.setFontSize(18);
  doc.text('Informe de Ingresos y Gastos', 14, 22);

  // Agregar ingresos y balance
  doc.setFontSize(12);
  doc.text(`Dinero inicial: $${initialMoney.toFixed(2)}`, 14, 40);
  doc.text(`Balance total: $${totalBalance.toFixed(2)}`, 14, 50);
  doc.text(`Total ahorrado: $${totalSavings.toFixed(2)}`, 14, 60);

  // Agregar tabla de gastos
  let startY = 80;
  const tableColumn = ["Fecha", "Descripción", "Cantidad"];
  const tableRows = [];

  // Obtener los datos de la tabla
  const tableBody = document.querySelector('#expense-table tbody');
  tableBody.querySelectorAll('tr').forEach(row => {
    const rowData = [];
    row.querySelectorAll('td').forEach(cell => {
      rowData.push(cell.textContent);
    });
    tableRows.push(rowData);
  });

  // Insertar tabla en el PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: startY,
  });

  // Guardar el PDF con un nombre específico
  doc.save('informe_ingresos_gastos.pdf');
});
