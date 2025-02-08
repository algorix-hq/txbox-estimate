import React, { useState, useEffect } from 'react';
import { Calculator, Printer, Copy } from 'lucide-react';
import tnboxLogo from './assets/images/tnbox-logo.png';

const QuoteCalculator = () => {
  const [inkjet, setInkjet] = useState('');
  const [laser, setLaser] = useState('');
  const [contract, setContract] = useState('');
  const [memo, setMemo] = useState('');
  
  const [calculations, setCalculations] = useState({
    basePrice: 40000,
    inkjetCost: 0,
    laserCost: 0,
    contractCost: 0,
    subtotal: 40000,
    tax: 4000,
    total: 44000,
    chargeableInkjet: 0,
    chargeableLaser: 0
  });

  // URL 파라미터 읽어오기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inkjetParam = params.get('inkjet');
    const laserParam = params.get('laser');
    const contractParam = params.get('contract');
    const memoParam = params.get('memo');

    if (inkjetParam !== null) setInkjet(inkjetParam);
    if (laserParam !== null) setLaser(laserParam);
    if (contractParam !== null) setContract(contractParam);
    if (memoParam) {
      try {
        const decoded = decodeURIComponent(memoParam);
        setMemo(decoded);
      } catch (e) {
        console.error('Failed to decode memo:', e);
      }
    }
  }, []);

  // URL 업데이트 및 계산
  useEffect(() => {
    const params = new URLSearchParams();
    if (inkjet !== '') params.set('inkjet', inkjet);
    if (laser !== '') params.set('laser', laser);
    if (contract !== '') params.set('contract', contract);
    if (memo) params.set('memo', encodeURIComponent(memo));

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);

    const basePrice = 40000;
    const laserCount = Math.max(0, parseInt(laser) || 0);
    const inkjetCount = Math.max(0, parseInt(inkjet) || 0);
    
    const deductFromLaser = Math.min(100, laserCount);
    const remainingMonitoring = Math.max(0, 100 - deductFromLaser);
    const deductFromInkjet = Math.min(remainingMonitoring, inkjetCount);
    
    const chargeableLaser = laserCount - deductFromLaser;
    const chargeableInkjet = inkjetCount - deductFromInkjet;
    
    const inkjetCost = chargeableInkjet * 200;
    const laserCost = chargeableLaser * 300;
    
    const excessContract = Math.max(0, parseInt(contract) - 300);
    const contractCost = Math.floor(excessContract / 100) * 10000;
    
    const subtotal = basePrice + inkjetCost + laserCost + contractCost;
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;
    
    setCalculations({
      basePrice,
      inkjetCost,
      laserCost,
      contractCost,
      subtotal,
      tax,
      total,
      chargeableInkjet,
      chargeableLaser
    });
  }, [inkjet, laser, contract, memo]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={tnboxLogo} alt="TNBOX 로고" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">견적서</h1>
        </div>
        <div className="flex items-center gap-4">
          <Calculator className="w-8 h-8 text-blue-500" />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('링크가 복사되었습니다.');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
          >
            <Copy className="w-4 h-4" />
            <span>링크 복사</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄</span>
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        견적일자: {currentDate}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            잉크젯 프린터 수량
          </label>
          <input
            type="number"
            min="0"
            value={inkjet}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              setInkjet(value === '' ? '' : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            레이저 프린터 수량
          </label>
          <input
            type="number"
            min="0"
            value={laser}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              setLaser(value === '' ? '' : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            품목계약 수량
          </label>
          <input
            type="number"
            min="0"
            value={contract}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              setContract(value === '' ? '' : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
        <div>
          <p className="mb-1"><strong>총 프린터:</strong> {formatNumber((parseInt(inkjet) || 0) + (parseInt(laser) || 0))}대</p>
          <p className="mb-1"><strong>잉크젯:</strong> {formatNumber(parseInt(inkjet) || 0)}대</p>
          <p className="mb-1"><strong>레이저:</strong> {formatNumber(parseInt(laser) || 0)}대</p>
        </div>
        <div>
          <p className="mb-1"><strong>품목계약:</strong> {formatNumber(parseInt(contract) || 0)}대</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">기본 사용료 (모니터링 100대 + 품목계약 300대)</span>
            <span className="font-medium">{formatNumber(calculations.basePrice)}원</span>
          </div>
          
          {calculations.chargeableInkjet > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">잉크젯 프린터 추가 비용 ({formatNumber(calculations.chargeableInkjet)}대 × 200원)</span>
              <span className="font-medium">{formatNumber(calculations.inkjetCost)}원</span>
            </div>
          )}
          
          {calculations.chargeableLaser > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">레이저 프린터 추가 비용 ({formatNumber(calculations.chargeableLaser)}대 × 300원)</span>
              <span className="font-medium">{formatNumber(calculations.laserCost)}원</span>
            </div>
          )}
          
          {calculations.contractCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">품목계약 추가 비용 (초과 {formatNumber(Math.max(0, parseInt(contract) - 300))}대)</span>
              <span className="font-medium">{formatNumber(calculations.contractCost)}원</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="font-medium">소계</span>
            <span className="font-medium">{formatNumber(calculations.subtotal)}원</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">부가세 (10%)</span>
            <span className="font-medium">{formatNumber(calculations.tax)}원</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
            <span>총액</span>
            <span>{formatNumber(calculations.total)}원</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <p>※ 모니터링은 기본 100대까지 포함되어 있으며, 레이저 프린터부터 우선 공제됩니다.</p>
        <p>※ 품목계약은 기본 300대까지 포함되어 있으며, 400대부터 100대 단위로 10,000원이 추가됩니다.</p>
        <p>※ 모든 금액은 부가세 별도입니다.</p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">참고사항</h3>
            <textarea
              className="w-full h-32 border border-gray-300 rounded p-3 text-sm"
              placeholder="담당자: 권석일 부장
연락처: 010-9007-9175
이메일: imkorean@tinteccnc.com"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">공급자 정보</h3>
            <div className="text-sm space-y-2">
              <p>주식회사 틴텍씨앤씨</p>
              <p>사업자등록번호: 808-87-01665</p>
              <p>대표자: 임국주</p>
              <p>서울특별시 강서구 마곡중앙로 111, 101동 (업무)317호</p>
              <p className="text-gray-500">(마곡동, 롯데캐슬 르웨스트)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;