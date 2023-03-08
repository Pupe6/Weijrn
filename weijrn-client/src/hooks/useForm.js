import React, { useState } from 'react';

export default function useForm(initialState = {}) {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
