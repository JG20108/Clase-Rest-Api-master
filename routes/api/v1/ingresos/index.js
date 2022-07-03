const express = require('express');
const router = express.Router();
const Ingresos = require('../../../../libs/ingresos');
const IngresosDao = require('../../../../dao/models/IngresosDao');
const ingresoDao = new IngresosDao();
const ingreso = new Ingresos(ingresoDao);
ingreso.init();

router.get('/', async (req, res) => {
    // extraer y validar datos del request
    try {
        // devolver la ejecución el controlador de esta ruta
        const versionData = await ingreso.getIngresosVersion();
        return res.status(200).json(versionData);
    } catch (ex) {
        // manejar el error que pueda tirar el controlador
        console.error('Error:', ex);
        return res.status(502).json({ 'error': 'Error Interno de Server' });
    }
});

router.get('/allIngresos', async (req, res) => {
    // extraer y validar datos del request
    try {
        // devolver la ejecución el controlador de esta ruta
        const AllIngresos = await ingreso.getIngresos();
        return res.status(200).json(AllIngresos);
    } catch (ex) {
        // manejar el error que pueda tirar el controlador
        console.error('Error:', ex);
        return res.status(501).json({ error: 'Error al procesar solicitud.' });
    }
});

router.get('/ingresoById/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!(/^\d+$/.test(id))) {
            return res.status(400).json({
                error: 'Se espera un código numérico'
            });
        }
        const ingresoExistente = await ingreso.getIngresosById({ id: parseInt(id) });

        if(!ingresoExistente){
            return res.status(404).json({ error: 'no se encontró el ingreso' });
        }
        return res.status(200).json(ingresoExistente);
    } catch (ex) {
        console.error(ex);
        return res.status(501).json({ error: 'Error al procesar solicitud.' });
    }
});

router.post('/new', async (req, res) => {
    try {
        const { type,description,amount,category } = req.body;
        
        if (/^\s*$/.test(description)) {
            return res.status(400).json({
                error: 'Se espera el valor de description'
            });
        }
        if (/^\s*$/.test(category)) {
            return res.status(400).json({
                error: 'Se espera el valor de correo electrónico'
            });
        }

        if (!(parseFloat(amount))) {
            
            return res.status(400).json({
                error: 'Se espera un valor numérico'
            });
        }

        if (/^\s*$/.test(amount)) {
            return res.status(400).json({
                error: 'Se espera el valor de amount'
            });
        }

        if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
            return res.status(400).json({
                error: 'Se espera el valor de INCOME o EXPENSES'
            });
        }
        const newIngreso = await ingreso.addIngreso({type,description,amount: parseFloat(amount),category });
        return res.status(200).json(newIngreso);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({ error: 'Error al procesar solicitud' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!(/^\d+$/.test(id))) {
            return res.status(400).json({ error: 'El código debe ser un dígito válido.' });
        }
        const { type,description,amount,category } = req.body;
       
        if (/^\s*$/.test(description)) {
            return res.status(400).json({
                error: 'Se espera el valor de description'
            });
        }
        if (/^\s*$/.test(category)) {
            return res.status(400).json({
                error: 'Se espera el valor de correo electrónico'
            });
        }

        if (!(parseFloat(amount))) {
            
            return res.status(400).json({
                error: 'Se espera un valor numérico'
            });
        }

        if (/^\s*$/.test(amount)) {
            return res.status(400).json({
                error: 'Se espera el valor de amount'
            });
        }

        if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
            return res.status(400).json({
                error: 'Se espera el valor de INCOME o EXPENSES'
            });
        }

        const updateResult = await ingreso.updateIngresos({ type,description,amount: parseFloat(amount),category,id: parseInt(id) })

        if (!updateResult) {
            return res.status(404).json({ error: 'Información no encontrada.' });
        }
        return res.status(200).json({ updatedUser: updateResult });

    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: 'Error al procesar solicitud.' });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!(/^\d+$/.test(id))) {
            return res.status(400).json({ error: 'El código debe ser un dígito válido.' });
        }

        const deletedIngreso = await ingreso.deleteIngresos({ id: parseInt(id) });

        if (!deletedIngreso) {
            return res.status(404).json({ error: 'Información no encontrada.' });
        }
        return res.status(200).json({ deletedIngreso });

    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: 'Error al procesar solicitud.' });
    }
});
module.exports = router;