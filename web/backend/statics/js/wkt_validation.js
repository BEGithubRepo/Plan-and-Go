// static/js/wkt-validation.js

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.wkt-geometry-input').forEach(input => {
        input.addEventListener('blur', function(e) {
            const pattern = /^POINT\(\d+\.?\d* \d+\.?\d*\)$/i;
            if (!pattern.test(e.target.value)) {
                e.target.classList.add('is-invalid');
                e.target.nextElementSibling.textContent = 'Geçersiz WKT formatı! Örnek: POINT(28.9784 41.0082)';
            } else {
                e.target.classList.remove('is-invalid');
                e.target.nextElementSibling.textContent = '';
            }
        });
    });
});