import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [conversions, setConversions] = useState([{
    id: 0,
    inputValue: '',
    outputValue: '',
    fromUnit: 'meters',
    toUnit: 'kilometers',
    unitType: 'length',
    boxColor: '#252525',
  }]);
  const [hovering, setHovering] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Unit Converter',
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      enterValue: 'Enter value',
      result: 'Result',
      temperature: 'Temperature',
      length: 'Length',
      weight: 'Weight',
      area: 'Area',
      volume: 'Volume',
      time: 'Time',
      addConversion: '+ Add Conversion',
    },
    es: {
      title: 'Convertidor de Unidades',
      home: 'Inicio',
      about: 'Acerca de',
      services: 'Servicios',
      contact: 'Contacto',
      enterValue: 'Ingrese un valor',
      result: 'Resultado',
      temperature: 'Temperatura',
      length: 'Longitud',
      weight: 'Peso',
      area: 'Área',
      volume: 'Volumen',
      time: 'Tiempo',
      addConversion: '+ Agregar Conversión',
    },
    zh: {
      title: '单位换算器',
      home: '主页',
      about: '关于',
      services: '服务',
      contact: '联系方式',
      enterValue: '输入值',
      result: '结果',
      temperature: '温度',
      length: '长度',
      weight: '重量',
      area: '面积',
      volume: '体积',
      time: '时间',
      addConversion: '+ 添加转换',
    },
    hi: {
      title: 'इकाई परिवर्तक',
      home: 'होम',
      about: 'के बारे में',
      services: 'सेवाएँ',
      contact: 'संपर्क',
      enterValue: 'मान दर्ज करें',
      result: 'परिणाम',
      temperature: 'तापमान',
      length: 'लंबाई',
      weight: 'वजन',
      area: 'क्षेत्र',
      volume: 'आयतन',
      time: 'समय',
      addConversion: '+ रूपांतरण जोड़ें',
    },
    ar: {
      title: 'محول الوحدات',
      home: 'الرئيسية',
      about: 'حول',
      services: 'خدمات',
      contact: 'اتصل',
      enterValue: 'أدخل القيمة',
      result: 'النتيجة',
      temperature: 'درجة الحرارة',
      length: 'طول',
      weight: 'وزن',
      area: 'مساحة',
      volume: 'حجم',
      time: 'وقت',
      addConversion: '+ إضافة تحويل',
    },
  };

  const units = {
    temperature: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    },
    length: {
      meters: 1,
      kilometers: 1000,
      feet: 0.3048,
      miles: 1609.34,
      inches: 0.0254,
    },
    weight: {
      grams: 1,
      kilograms: 1000,
      pounds: 453.592,
      ounces: 28.3495,
    },
    area: {
      sqmeters: 1,
      sqkilometers: 1000000,
      sqfeet: 0.092903,
      sqmiles: 2589988.11,
    },
    volume: {
      liters: 1,
      milliliters: 0.001,
      cubicmeters: 1000,
      cubicfeet: 28.3168,
    },
    time: {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
    },
  };

  const unitOptions = {
    temperature: Object.keys(units.temperature),
    length: Object.keys(units.length),
    weight: Object.keys(units.weight),
    area: Object.keys(units.area),
    volume: Object.keys(units.volume),
    time: Object.keys(units.time),
  };

  useEffect(() => {
    conversions.forEach((conversion, index) => {
      convert(index);
    });
  }, [conversions]);

  const convert = (index) => {
    const conversion = conversions[index];
    if (conversion.inputValue === '') {
      updateConversion(index, { ...conversion, outputValue: '' });
      return;
    }

    let fromValue = parseFloat(conversion.inputValue);

    if (conversion.unitType === 'temperature') {
      if (conversion.fromUnit === 'celsius') {
        fromValue = parseFloat(conversion.inputValue);
      } else if (conversion.fromUnit === 'fahrenheit') {
        fromValue = (parseFloat(conversion.inputValue) - 32) * 5 / 9;
      } else if (conversion.fromUnit === 'kelvin') {
        fromValue = parseFloat(conversion.inputValue) - 273.15;
      }

      let toValue;
      if (conversion.toUnit === 'celsius') {
        toValue = fromValue;
      } else if (conversion.toUnit === 'fahrenheit') {
        toValue = (fromValue * 9 / 5) + 32;
      } else if (conversion.toUnit === 'kelvin') {
        toValue = fromValue + 273.15;
      }

      updateConversion(index, { ...conversion, outputValue: toValue.toFixed(4) });
    } else {
      const fromBaseValue = parseFloat(conversion.inputValue) * units[conversion.unitType][conversion.fromUnit];
      const toValue = fromBaseValue / units[conversion.unitType][conversion.toUnit];
      updateConversion(index, { ...conversion, outputValue: toValue.toFixed(4) });
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      updateConversion(index, { ...conversions[index], inputValue: value });
    }
  };

  const swapUnits = (index) => {
    const conversion = conversions[index];
    const tempUnit = conversion.fromUnit;
    updateConversion(index, { ...conversion, fromUnit: conversion.toUnit, toUnit: tempUnit });
  };

  const handleOutputValueChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const conversion = conversions[index];
      updateConversion(index, { ...conversion, outputValue: value });

      let toBaseValue;
      if (conversion.unitType === 'temperature') {
        let tempValue = parseFloat(value);
        if (conversion.toUnit === 'celsius') {
          toBaseValue = tempValue;
        } else if (conversion.toUnit === 'fahrenheit') {
          toBaseValue = (tempValue - 32) * 5 / 9;
        } else if (conversion.toUnit === 'kelvin') {
          toBaseValue = tempValue - 273.15;
        }

        let fromValue;
        if (conversion.fromUnit === 'celsius') {
          fromValue = toBaseValue;
        } else if (conversion.fromUnit === 'fahrenheit') {
          fromValue = (toBaseValue * 9 / 5) + 32;
        } else if (conversion.fromUnit === 'kelvin') {
          fromValue = toBaseValue + 273.15;
        }
        updateConversion(index, { ...conversion, inputValue: fromValue.toFixed(4) });
      }
      else {
        const toBaseValue = parseFloat(value) * units[conversion.unitType][conversion.toUnit];
        const fromValue = toBaseValue / units[conversion.unitType][conversion.fromUnit];
        updateConversion(index, { ...conversion, inputValue: fromValue.toFixed(4) });
      }
    }
  };

  const handleUnitTypeChange = (newUnitType, index) => {
    const conversion = conversions[index];
    updateConversion(index, {
      ...conversion,
      unitType: newUnitType,
      fromUnit: unitOptions[newUnitType][0],
      toUnit: unitOptions[newUnitType][1],
      inputValue: '',
      outputValue: '',
    });
  };

  const updateConversion = (index, updatedConversion) => {
    const newConversions = [...conversions];
    newConversions[index] = updatedConversion;
    setConversions(newConversions);
  };

  const addConversion = () => {
    const lastColor = conversions.length > 0 ? conversions[conversions.length - 1].boxColor : '#252525';
    const newColor = shiftColor(lastColor, 10);

    setConversions([...conversions, {
      id: conversions.length,
      inputValue: '',
      outputValue: '',
      fromUnit: 'meters',
      toUnit: 'kilometers',
      unitType: 'length',
      boxColor: newColor,
    }]);
  };

  const shiftColor = (hexColor, shiftAmount) => {
    let hex = hexColor.replace('#', '');

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const num = parseInt(hex, 16);

    let r = (num >> 16) + shiftAmount;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + shiftAmount;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + shiftAmount;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    let new_hex = g | (b << 8) | (r << 16);

    const color = '#' + new_hex.toString(16);
    return color;
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== dropIndex) {
      const newConversions = [...conversions];
      const temp = newConversions[draggingIndex];
      newConversions[draggingIndex] = newConversions[dropIndex];
      newConversions[dropIndex] = temp;
      setConversions(newConversions);
    }
    setDraggingIndex(null);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = translations[language];

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-brand">Quanto</div>
        <div className="nav-buttons">
          <button>{t.home}</button>
          <button>{t.about}</button>
          <button>{t.services}</button>
          <button>{t.contact}</button>
        </div>
        <div className="language-selector">
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="en">English 🇺🇸</option>
            <option value="es">Español 🇪🇸</option>
            <option value="zh">中文 🇨🇳</option>
            <option value="hi">हिन्दी 🇮🇳</option>
            <option value="ar">العربية 🇸🇦</option>
          </select>
        </div>
      </nav>
      <div className="container">
        <h1>{t.title}</h1>
        {conversions.map((conversion, index) => (
          <div
            className={`conversion-box ${draggingIndex === index ? 'dragging' : ''}`}
            key={conversion.id}
            style={{ backgroundColor: conversion.boxColor }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="drag-handle" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnd={handleDragEnd}>
              &#9776;
            </div>
            <div className="unit-type-buttons">
              <button
                className={`unit-type-button ${conversion.unitType === 'temperature' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('temperature', index)}
              >
                {t.temperature}
              </button>
              <button
                className={`unit-type-button ${conversion.unitType === 'length' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('length', index)}
              >
                {t.length}
              </button>
              <button
                className={`unit-type-button ${conversion.unitType === 'weight' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('weight', index)}
              >
                {t.weight}
              </button>
              <button
                className={`unit-type-button ${conversion.unitType === 'area' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('area', index)}
              >
                {t.area}
              </button>
              <button
                className={`unit-type-button ${conversion.unitType === 'volume' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('volume', index)}
              >
                {t.volume}
              </button>
              <button
                className={`unit-type-button ${conversion.unitType === 'time' ? 'active' : ''}`}
                onClick={() => handleUnitTypeChange('time', index)}
              >
                {t.time}
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder={t.enterValue}
                value={conversion.inputValue}
                onChange={(e) => handleInputChange(e, index)}
              />
              <select className="select-unit accent-color" value={conversion.fromUnit} onChange={(e) => updateConversion(index, { ...conversion, fromUnit: e.target.value })}>
                {unitOptions[conversion.unitType].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="swap-button-container">
              <button className="swap-button accent-color" onClick={() => swapUnits(index)}>
                &#8644;
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder={t.result}
                value={conversion.outputValue}
                onChange={(e) => handleOutputValueChange(e, index)}
              />
              <select className="select-unit accent-color" value={conversion.toUnit} onChange={(e) => updateConversion(index, { ...conversion, toUnit: e.target.value })}>
                {unitOptions[conversion.unitType].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <div
          className="add-conversion-section"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <hr className="add-conversion-line" />
          {hovering && (
            <button className="add-conversion-button" onClick={addConversion}>
              {t.addConversion}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
