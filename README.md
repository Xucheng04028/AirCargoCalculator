<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>空运成本计算器（五五分泡版）</title>
    <style>
        
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
        .calculator {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .result {
            font-weight: bold;
            color: #2980b9;
            background-color: #f8f9fa;
        }
        .formula {
            font-size: 0.85em;
            color: #7f8c8d;
            font-family: Consolas, monospace;
        }
        .note {
            background-color: #e7f4ff;
            border-left: 4px solid #3498db;
            padding: 10px;
            margin: 15px 0;
        }
        button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            width: 100%;
        }
        button:hover {
            background-color: #2980b9;
        }
        .section-title {
            font-weight: bold;
            color: #16a085;
            margin: 20px 0 10px 0;
        }
    </style>
</head>
<body>
    <h1>空运成本计算器（五五分泡版）</h1>
    
    <div class="calculator">
        <div class="section-title">基础参数</div>
        <table>
            <tr>
                <td>体积 (m³)</td>
                <td><input type="number" id="volume" step="0.001" placeholder="输入体积"></td>
                <td>C.W. (计费重量, kg)</td>
                <td class="result" id="cw">-</td>
            </tr>
            <tr>
                <td>G.W. (实际重量, kg)</td>
                <td><input type="number" id="gw" step="0.001" placeholder="输入实际重量"></td>
                <td>比例</td>
                <td class="result" id="ratio">-</td>
            </tr>
            <tr>
                <td>USD/RMB汇率</td>
                <td><input type="number" id="exchangeRate" step="0.0001" value="7.2" placeholder="输入汇率"></td>
                
                <td>成本计费重 (kg)</td>
                <td class="result" id="costWeight">-</td>
            </tr>
        </table>

        <div class="section-title">成本计算</div>
        <table>
            <tr>
                <td>成本空运费RMB/KG</td>
                <td><input type="number" id="rmbPerKg" step="0.01" placeholder="输入RMB单价"></td>
                
                <td>分泡后RMB/KG</td>
                <td class="result" id="rmbAfter">-</td>
            </tr>
            <tr>
    <td>成本空运费USD/KG</td>
    <td class="result" id="usdPerKg">-</td>
   
    <td>分泡后USD/KG</td>
    <td class="result" id="usdAfter">-</td>
</tr>
        </table>

        <div class="section-title">总成本</div>
        <table>
            <tr>
                <td colspan="2"></td>
                
                <td>空运总成本RMB</td>
                <td class="result" id="totalRMB">-</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                
                <td>空运总成本USD</td>
                <td class="result" id="totalUSD">-</td>
            </tr>
        </table>
        
        <button onclick="calculate()">计算所有结果</button>
        
       
    </div>

    <script>
    function calculate() {
    try {
        // 获取输入值
        const volume = parseFloat(document.getElementById('volume').value) || 0;
        const gw = parseFloat(document.getElementById('gw').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 7.2;
        const rmbPerKg = parseFloat(document.getElementById('rmbPerKg').value) || 0;

        // 计算C.W. (计费重量)
        const cw = volume / 0.006;
        document.getElementById('cw').textContent = cw.toFixed(2);

        // 计算比例 (GW/体积)
        const ratio = volume > 0 ? gw / volume : 0;
        document.getElementById('ratio').textContent = ratio.toFixed(4);

        // 计算成本计费重 (分泡后重量)
        const costWeight = (cw - gw) / 2 + gw;
        document.getElementById('costWeight').textContent = costWeight.toFixed(2);

        // 计算成本空运费USD/KG (RMB/KG ÷ 汇率)
        const costUsdPerKg = exchangeRate > 0 ? rmbPerKg / exchangeRate : 0;
        document.getElementById('usdPerKg').textContent = costUsdPerKg.toFixed(4);

        // 计算总成本
        const totalRMB = costWeight * rmbPerKg;
        const totalUSD = costWeight * costUsdPerKg;
        document.getElementById('totalRMB').textContent = totalRMB.toFixed(2);
        document.getElementById('totalUSD').textContent = totalUSD.toFixed(2);

        // === 修正分泡后单价公式 ===
        // 分泡后RMB/KG = 总空运成本RMB / C.W.
        const rmbAfter = cw > 0 ? totalRMB / cw : 0;
        document.getElementById('rmbAfter').textContent = rmbAfter.toFixed(4);

        // 分泡后USD/KG = 总空运成本USD / C.W.
        const usdAfter = cw > 0 ? totalUSD / cw : 0;
        document.getElementById('usdAfter').textContent = usdAfter.toFixed(4);

    } catch (e) {
        alert("计算错误: " + e.message);
    }
}
</script>
</body>
</html>
