
  document.addEventListener("DOMContentLoaded", function() {
    // Dados fictícios de usuários para simular o login
    const users = [
        { username: 'func', password: 'func123', role: 'func' },
        { username: 'funcionario', password: 'func123', role: 'funcionario' }
    ];

    // Armazenamento local dos tickets (simulando banco de dados)
    let tickets = [
        { plate: 'ABC-1234', fullName: 'Carlos Oliveira', cpf: '111.222.333-44', phone: '991234567', entryTime: '09/01/2025 08:00', exitTime: '09/01/2025 09:00', value: 12.00 },
        { plate: 'XYZ-9876', fullName: 'Fernanda Costa', cpf: '555.444.333-22', phone: '999876543', entryTime: '09/01/2025 10:00', exitTime: null, value: 15.00 }
    ];

    // Função para login
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            if (user.role === 'func') {
                showParkingScreen();
            } else {
                alert("Área restrita para funcionários.");
            }
        } else {
            alert("Usuário ou senha inválidos.");
        }
    });

    // Função para mostrar a tela de estacionamento
    function showParkingScreen() {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("parkingScreen").style.display = "block";
        loadTickets();
    }

    // Função para fazer o logout
    function logout() {
        document.getElementById("parkingScreen").style.display = "none";
        document.getElementById("loginScreen").style.display = "block";
    }

    // Função para mostrar o formulário de novo ticket
    function showNewTicketForm() {
        document.getElementById("newTicketForm").style.display = "block"; // Exibe o formulário
        document.getElementById("ticketForm").reset(); // Limpa o formulário
    }

    // Função para cancelar o preenchimento do novo ticket
    function cancelNewTicket() {
        document.getElementById("newTicketForm").style.display = "none"; // Esconde o formulário
    }

    // Função para calcular o valor do estacionamento
    function calculateParkingFee(entryTime, exitTime) {
        const entryDate = new Date(entryTime);
        const exitDate = new Date(exitTime);
        const diffInHours = (exitDate - entryDate) / (1000 * 60 * 60); // Diferença em horas

        let total = 12.00; // Tarifa inicial para 1 hora

        if (diffInHours > 1) {
            total += (diffInHours - 1) * 6.00 * 0.5; // Desconto de 50% na segunda hora em diante
        }

        return total.toFixed(2);
    }

    // Função para criar um novo ticket com os dados preenchidos
    document.getElementById("ticketForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const plate = document.getElementById("plate").value;
        const fullName = document.getElementById("fullName").value;
        const cpf = document.getElementById("cpf").value;
        const phone = document.getElementById("phone").value;
        const entryTime = new Date(document.getElementById("entryTime").value).toLocaleString();

        const ticket = {
            plate: plate,
            fullName: fullName,
            cpf: cpf,
            phone: phone,
            entryTime: entryTime,
            exitTime: null,
            value: 12.00 // Definido como valor fixo para simplificação
        };

        // Adiciona o ticket à lista (simula inserção no "banco de dados")
        tickets.push(ticket);

        // Atualiza a tabela de tickets
        addTicket(ticket);

        // Atualiza o XML (simulação de salvar no XML)
        saveToXML();

        // Fecha o formulário após o envio
        document.getElementById("newTicketForm").style.display = "none";
    });

    function addTicket(ticket) {
        const tableBody = document.getElementById("ticketTable").getElementsByTagName('tbody')[0];
        const newRow = tableBody.insertRow();

        newRow.innerHTML = `
            <td>${ticket.plate}</td>
            <td>${ticket.fullName}</td>
            <td>${ticket.entryTime}</td>
            <td>${ticket.exitTime ? ticket.exitTime : 'Em aberto'}</td>
            <td>${ticket.value}</td>
            <td>
                <button class="btn btn-danger" onclick="removeTicket(this)">Remover</button>
            </td>
        `;
    }

    function removeTicket(button) {
        const row = button.closest('tr');
        const plate = row.cells[0].textContent; // Pega a placa do ticket a ser removido

        tickets = tickets.filter(ticket => ticket.plate !== plate);

        row.remove();

        saveToXML();
    }

    function viewTicketDetails(plate) {
        const ticket = tickets.find(t => t.plate === plate);
        if (ticket) {
            document.getElementById("ticketDetails").innerHTML = `
                <strong>Placa:</strong> ${ticket.plate} <br>
                <strong>Nome:</strong> ${ticket.fullName} <br>
                <strong>CPF:</strong> ${ticket.cpf} <br>
                <strong>Telefone:</strong> ${ticket.phone} <br>
                <strong>Entrada:</strong> ${ticket.entryTime} <br>
                <strong>Saída:</strong> ${ticket.exitTime ? ticket.exitTime : 'Em aberto'} <br>
                <strong>Valor:</strong> ${ticket.value} <br>
            `;
            document.getElementById("ticketDetailPage").style.display = "block";
            document.getElementById("parkingScreen").style.display = "none";
        }
    }

    function backToParkingScreen() {
        document.getElementById("ticketDetailPage").style.display = "none";
        document.getElementById("parkingScreen").style.display = "block";
    }

    function loadTickets() {
        tickets.forEach(ticket => addTicket(ticket));
    }

    function saveToXML() {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8" ?>\n<parking>\n';
        tickets.forEach(ticket => {
            xmlContent += `
                <ticket>
                    <plate>${ticket.plate}</plate>
                    <fullName>${ticket.fullName}</fullName>
                    <cpf>${ticket.cpf}</cpf>
                    <phone>${ticket.phone}</phone>
                    <entryTime>${ticket.entryTime}</entryTime>
                    <exitTime>${ticket.exitTime ? ticket.exitTime : ''}</exitTime>
                    <value>${ticket.value}</value>
                </ticket>
            `;
        });
        xmlContent += '</parking>';

        console.log("XML Atualizado:\n", xmlContent); // Aqui você veria a simulação do XML sendo atualizado
    }
});
