const treatments = {
    tambal_kecil: { name: 'Tambal Gigi Kecil', price: 500000 },
    tambal_sedang: { name: 'Tambal Gigi Sedang', price: 800000 },
    tambal_besar: { name: 'Tambal Gigi Besar', price: 1200000 },
    scaling: { name: 'Scaling Gigi', price: 300000 },
    cabut_gigi: { name: 'Cabut Gigi', price: 250000 },
    root_canal: { name: 'Root Canal Treatment', price: 1500000 },
    crown: { name: 'Pemasangan Crown', price: 2000000 },
    konsultasi: { name: 'Konsultasi Dokter', price: 150000 },
    rontgen: { name: 'Rontgen Gigi', price: 200000 },
    bleaching: { name: 'Bleaching Gigi', price: 1000000 }
};

let selectedTreatments = [];
let patientData = null;

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function updatePatientInfo() {
    const patientInfo = document.getElementById('patientInfo');
    const displayQueue = document.getElementById('displayQueue');
    const displayName = document.getElementById('displayName');
    const displayAge = document.getElementById('displayAge');
    const displayPhone = document.getElementById('displayPhone');
    const displayEmail = document.getElementById('displayEmail');
    const displayDate = document.getElementById('displayDate');
    
    displayQueue.textContent = patientData.queueNumber;
    displayName.textContent = patientData.name;
    displayAge.textContent = `${patientData.age} tahun`;
    displayPhone.textContent = patientData.phone || '-';
    displayEmail.textContent = patientData.email || '-';
    displayDate.textContent = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    patientInfo.style.display = 'block';
}

function updateDiagnosis(diagnosis) {
    const diagnosisSection = document.getElementById('diagnosisSection');
    const diagnosisText = document.getElementById('diagnosisText');
    
    diagnosisText.textContent = diagnosis;
    diagnosisSection.style.display = 'block';
}

function renderTreatments() {
    const treatmentItems = document.getElementById('treatmentItems');
    
    if (selectedTreatments.length === 0) {
        treatmentItems.innerHTML = `
            <p style="text-align: center; opacity: 0.7; padding: 40px 0;">
                <i class="fas fa-clipboard-list fa-3x" style="display: block; margin-bottom: 15px;"></i>
                Belum ada tindakan yang ditambahkan
            </p>
        `;
        return;
    }
    
    treatmentItems.innerHTML = selectedTreatments.map((treatment, index) => `
        <div class="treatment-item">
            <div class="treatment-name">${treatment.name}</div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div class="treatment-price">${formatCurrency(treatment.price)}</div>
                <button class="remove-btn" onclick="removeTreatment(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateTotal() {
    const total = selectedTreatments.reduce((sum, treatment) => sum + treatment.price, 0);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

function removeTreatment(index) {
    selectedTreatments.splice(index, 1);
    renderTreatments();
    updateTotal();
    showAlert('Tindakan berhasil dihapus', 'success');
}

function resetForm() {
    // Reset all data
    selectedTreatments = [];
    patientData = null;
    
    // Reset form fields
    document.getElementById('patientForm').reset();
    
    // Clear queue number field (let user input manually)
    document.getElementById('queueNumber').value = '';
    
    // Enable all fields
    document.getElementById('queueNumber').disabled = false;
    document.getElementById('patientName').disabled = false;
    document.getElementById('patientAge').disabled = false;
    document.getElementById('patientPhone').disabled = false;
    document.getElementById('patientEmail').disabled = false;
    document.getElementById('diagnosis').disabled = false;
    
    // Hide patient info and diagnosis sections
    document.getElementById('patientInfo').style.display = 'none';
    document.getElementById('diagnosisSection').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    
    // Update button text
    document.getElementById('addTreatmentBtn').innerHTML = '<i class="fas fa-plus"></i> Tambah Tindakan ke Bill';
    
    // Reset displays
    renderTreatments();
    updateTotal();
    
    showAlert('Form berhasil direset untuk pasien baru', 'success');
}

function clearBill() {
    if (selectedTreatments.length === 0 && !patientData) {
        showAlert('Tidak ada bill yang perlu dihapus', 'error');
        return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus seluruh bill ini? Data tidak dapat dikembalikan.')) {
        // Reset all data
        selectedTreatments = [];
        patientData = null;
        
        // Hide patient info and diagnosis sections
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('diagnosisSection').style.display = 'none';
        
        // Reset displays
        renderTreatments();
        updateTotal();
        
        // Enable form for new entry
        resetForm();
        
        showAlert('Seluruh bill berhasil dihapus', 'success');
    }
}

function generateBillText() {
    if (!patientData || selectedTreatments.length === 0) {
        return null;
    }

    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const total = selectedTreatments.reduce((sum, treatment) => sum + treatment.price, 0);
    
    let billText = `🏥 *KLINIK JHDC*\n`;
    billText += `📋 *BILL PEMBAYARAN*\n`;
    billText += `═══════════════════════\n\n`;
    
    billText += `🎫 *No. Antrian: ${patientData.queueNumber}*\n\n`;
    
    billText += `👤 *DATA PASIEN:*\n`;
    billText += `• Nama: ${patientData.name}\n`;
    billText += `• Umur: ${patientData.age} tahun\n`;
    billText += `• Telepon: ${patientData.phone || '-'}\n`;
    billText += `• Email: ${patientData.email || '-'}\n`;
    billText += `• Tanggal: ${currentDate}\n\n`;
    
    billText += `🦷 *TINDAKAN MEDIS:*\n`;
    selectedTreatments.forEach((treatment, index) => {
        billText += `${index + 1}. ${treatment.name}\n`;
        billText += `   ${formatCurrency(treatment.price)}\n`;
    });
    
    billText += `\n💰 *TOTAL PEMBAYARAN:*\n`;
    billText += `*${formatCurrency(total)}*\n\n`;
    
    if (patientData.diagnosis) {
        billText += `🩺 *DIAGNOSIS & KETERANGAN:*\n`;
        billText += `${patientData.diagnosis}\n\n`;
    }
    
    billText += `═══════════════════════\n`;
    billText += `Terima kasih atas kepercayaan Anda\n`;
    billText += `🏥 Klinik JHDC`;

    return billText;
}

document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const queueNumber = document.getElementById('queueNumber').value.trim();
    const patientName = document.getElementById('patientName').value.trim();
    const patientAge = document.getElementById('patientAge').value;
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const patientEmail = document.getElementById('patientEmail').value.trim();
    const treatmentSelect = document.getElementById('treatmentSelect').value;
    const diagnosis = document.getElementById('diagnosis').value.trim();
    
    // Validasi nomor antrian harus diisi
    if (!queueNumber) {
        showAlert('Nomor antrian harus diisi!', 'error');
        document.getElementById('queueNumber').focus();
        return;
    }
    
    // Set patient data only once
    if (!patientData) {
        patientData = {
            queueNumber: queueNumber,
            name: patientName,
            age: patientAge,
            phone: patientPhone,
            email: patientEmail,
            diagnosis: diagnosis
        };
        updatePatientInfo();
        updateDiagnosis(diagnosis);
    }
    
    if (treatmentSelect && treatments[treatmentSelect]) {
        const treatment = treatments[treatmentSelect];
        selectedTreatments.push(treatment);
        renderTreatments();
        updateTotal();
        
        // Reset only treatment selection, keep patient data
        document.getElementById('treatmentSelect').value = '';
        
        // Disable patient fields after first submission and show reset button
        document.getElementById('queueNumber').disabled = true;
        document.getElementById('patientName').disabled = true;
        document.getElementById('patientAge').disabled = true;
        document.getElementById('patientPhone').disabled = true;
        document.getElementById('patientEmail').disabled = true;
        document.getElementById('diagnosis').disabled = true;
        document.getElementById('resetBtn').style.display = 'block';
        
        // Update button text to indicate adding more treatments
        document.getElementById('addTreatmentBtn').innerHTML = '<i class="fas fa-plus"></i> Tambah Tindakan Lagi';
        
        showAlert(`Tindakan "${treatment.name}" berhasil ditambahkan ke bill`, 'success');
    } else {
        showAlert('Pilih tindakan yang akan ditambahkan', 'error');
    }
});

// Set initial date when page loads
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Don't initialize queue number - let user input manually
    // The queue number field will be empty by default
});

// Input animations
const inputs = document.querySelectorAll('.form-input, .form-select');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});