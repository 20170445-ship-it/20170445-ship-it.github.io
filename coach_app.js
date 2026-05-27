// Smart Health Coach Core Application Logic — PAPS & BMI Combined HUD Edition

(function() {
  /* ── 1. DOM Element Selectors ── */
  const heightInput   = document.getElementById('userHeight');
  const weightInput   = document.getElementById('userWeight');
  const ageInput      = document.getElementById('userAge');
  const genderSelect  = document.getElementById('userGender');
  
  const bmiValBadge   = document.getElementById('bmiValue');
  const bmiPin        = document.getElementById('bmiPin');
  const bmiFeedback   = document.getElementById('bmiFeedback');
  
  const screenTimeIn  = document.getElementById('screenTime');
  const screenTimeVal = document.getElementById('screenTimeVal');
  const circleProgress= document.getElementById('progressCircleDial');
  const targetTime    = document.getElementById('detoxTargetTime');
  const targetShield  = document.getElementById('detoxTargetShield');
  const riskAlert     = document.getElementById('detoxRiskAlert');
  
  const monthSelect   = document.getElementById('weatherMonth');
  const daySelect     = document.getElementById('weatherDay');
  const tempDisp      = document.getElementById('weatherTempDisp');
  const humDisp       = document.getElementById('weatherHumDisp');
  const windDisp      = document.getElementById('weatherWindDisp');
  const rainDisp      = document.getElementById('weatherRainDisp');
  const dustValDisp   = document.getElementById('weatherDustVal');
  const dustStatDisp  = document.getElementById('weatherDustStatus');
  const uvValDisp     = document.getElementById('weatherUvVal');
  const uvStatDisp    = document.getElementById('weatherUvStatus');
  
  const dustIcon      = document.getElementById('weatherDustIcon');
  const uvIcon        = document.getElementById('weatherUvIcon');
  const rainIcon      = document.getElementById('weatherRainIcon');
  const rainStatDisp   = document.getElementById('weatherRainStatus');
  
  const suitScore     = document.getElementById('suitabilityScore');
  const suitStatus    = document.getElementById('suitabilityStatus');
  const weatherAdvice = document.getElementById('weatherAdvice');
  const weatherBanner = document.getElementById('weatherSuitabilityBanner');
  
  const exerciseContainer  = document.getElementById('exerciseContainer');
  const progressPercent    = document.getElementById('progressPercentage');
  const detoxProgressFill  = document.getElementById('detoxProgressFill');

  // Real-time Fitness HUD Dashboard Filler selectors
  const dashCardioVal = document.getElementById('dashCardioVal');
  const dashCardioFill = document.getElementById('dashCardioFill');
  const dashCardioGrade = document.getElementById('dashCardioGrade');
  
  const dashFlexibilityVal = document.getElementById('dashFlexibilityVal');
  const dashFlexibilityFill = document.getElementById('dashFlexibilityFill');
  const dashFlexibilityGrade = document.getElementById('dashFlexibilityGrade');
  
  const dashStrengthVal = document.getElementById('dashStrengthVal');
  const dashStrengthFill = document.getElementById('dashStrengthFill');
  const dashStrengthGrade = document.getElementById('dashStrengthGrade');
  
  const dashSpeedVal = document.getElementById('dashSpeedVal');
  const dashSpeedFill = document.getElementById('dashSpeedFill');
  const dashSpeedGrade = document.getElementById('dashSpeedGrade');
  
  const dashBodyVal = document.getElementById('dashBodyVal');
  const dashBodyFill = document.getElementById('dashBodyFill');
  const dashBodyGrade = document.getElementById('dashBodyGrade');

  /* ── 2. Constants & Data Mapping ── */
  const AGE_TO_YEAR = {
    9:'초3', 10:'초4', 11:'초5', 12:'초6',
    13:'중1', 14:'중2', 15:'중3',
    16:'고1', 17:'고2', 18:'고3'
  };

  const GRADE_META = [
    { label:'5등급', name:'아주낮음', color:'#ef4444', bg:'rgba(239,68,68,0.12)', stars:'★☆☆☆☆' },
    { label:'4등급', name:'낮음',    color:'#f97316', bg:'rgba(249,115,22,0.12)', stars:'★★☆☆☆' },
    { label:'3등급', name:'보통',    color:'#eab308', bg:'rgba(234,179,8,0.12)',  stars:'★★★☆☆' },
    { label:'2등급', name:'높음',    color:'#22c55e', bg:'rgba(34,197,94,0.12)', stars:'★★★★☆' },
    { label:'1등급', name:'아주높음', color:'#38bdf8', bg:'rgba(56,189,248,0.15)', stars:'★★★★★' },
  ];

  const PAPS_GRADES = {
    "boys": {
      "shuttle":{"초3":[[16,22],[23,39],[40,64],[65,87],[88,100]],"초4":[[19,25],[26,44],[45,68],[69,95],[96,103]],"초5":[[22,28],[29,49],[50,72],[73,99],[100,107]],"초6":[[22,31],[32,53],[54,77],[78,103],[104,112]],"중1":[[15,19],[20,35],[36,49],[50,63],[64,73]],"중2":[[15,21],[22,37],[38,51],[52,65],[66,75]],"중3":[[16,23],[24,39],[40,53],[54,67],[68,79]],"고1":[[16,25],[26,41],[42,55],[56,69],[70,80]],"고2":[[16,27],[28,43],[44,57],[58,71],[72,81]],"고3":[[18,29],[30,45],[46,59],[60,73],[74,82]]},
      "longrun":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[[480,640],[410,479],[325,409],[282,324],[268,281]],"초6":[[450,587],[380,449],[315,379],[251,314],[243,250]],"중1":[[700,791],[600,699],[503,599],[426,502],[400,425]],"중2":[[680,774],[584,679],[488,583],[417,487],[380,416]],"중3":[[660,761],[568,659],[473,567],[408,472],[370,407]],"고1":[[640,755],[552,639],[458,551],[399,457],[370,398]],"고2":[[620,721],[536,619],[443,535],[390,442],[370,389]],"고3":[[600,701],[520,599],[428,519],[381,427],[362,380]]},
      "step":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[[44,46.9],[47,51.9],[52,61.9],[62,75.9],[76,95]],"초6":[null,null,null,null,null],"중1":[null,null,null,null,null],"중2":[null,null,null,null,null],"중3":[null,null,null,null,null],"고1":[null,null,null,null,null],"고2":[null,null,null,null,null],"고3":[null,null,null,null,null]},
      "sitreach":{"초3":[[-5.1,-4.1],[-4,0.9],[1,4.9],[5,7.9],[8,18]],"초4":[[-5.1,-4.1],[-4,0.9],[1,4.9],[5,7.9],[8,18]],"초5":[[-5.1,-4.1],[-4,0.9],[1,4.9],[5,7.9],[8,18]],"초6":[[-5.1,-4.1],[-4,0.9],[1,4.9],[5,7.9],[8,18]],"중1":[[-5.1,-4.1],[-4,1.9],[2,6.9],[7,9.9],[10,25]],"중2":[[-5.1,-4.1],[-4,1.9],[2,6.9],[7,9.9],[10,25]],"중3":[[-5.1,-3.1],[-3,2.5],[2.6,6.9],[7,9.9],[10,25]],"고1":[[-3.1,-2.1],[-2,3.9],[4,8.9],[9,12.9],[13,28]],"고2":[[-3.1,0],[0.1,4.9],[5,10.9],[11,15.9],[16,28]],"고3":[[-3.1,0],[0.1,4.9],[5,10.9],[11,15.9],[16,28]]},
      "flextest":{"초3":[[0,4],[5,5],[6,6],[7,7],[8,8]],"초4":[null,null,null,null,null],"초5":[null,null,null,null,null],"초6":[null,null,null,null,null],"중1":[null,null,null,null,null],"중2":[null,null,null,null,null],"중3":[null,null,null,null,null],"고1":[null,null,null,null,null],"고2":[null,null,null,null,null],"고3":[null,null,null,null,null]},
      "pushup":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[null,null,null,null,null],"초6":[null,null,null,null,null],"중1":[[0,3],[4,11],[12,24],[25,33],[34,41]],"중2":[[0,3],[4,11],[12,24],[25,33],[34,41]],"중3":[[0,3],[4,13],[14,24],[25,33],[34,41]],"고1":[[2,6],[7,15],[16,29],[30,45],[46,50]],"고2":[[7,10],[11,24],[25,41],[42,49],[50,54]],"고3":[[7,16],[17,29],[30,45],[46,55],[56,62]]},
      "crunch":{"초3":[[0,3],[4,13],[14,29],[30,65],[66,120]],"초4":[[0,6],[7,21],[22,39],[40,79],[80,120]],"초5":[[0,9],[10,21],[22,39],[40,79],[80,120]],"초6":[[0,9],[10,21],[22,39],[40,79],[80,120]],"중1":[[5,13],[14,32],[33,54],[55,89],[90,130]],"중2":[[5,13],[14,32],[33,54],[55,89],[90,130]],"중3":[[5,13],[14,32],[33,54],[55,89],[90,130]],"고1":[[8,14],[15,34],[35,59],[60,89],[90,130]],"고2":[[10,16],[17,34],[35,59],[60,89],[90,130]],"고3":[[10,16],[17,34],[35,59],[60,89],[90,130]]},
      "grip":{"초3":[[7.6,8.9],[9,11.9],[12,17.9],[18,30.9],[31,35]],"초4":[[8.9,11.4],[11.5,14.9],[15,18.4],[18.5,30.9],[31,36]],"초5":[[9.9,12.4],[12.5,16.9],[17,22.5],[22.6,32.9],[33,37]],"초6":[[11.2,14.9],[15,18.9],[19,26.4],[26.5,34.9],[35,39.4]],"중1":[[14.4,16.4],[16.5,22.4],[22.5,29.9],[30,41.9],[42,46]],"중2":[[19.1,21.9],[22,28.4],[28.5,36.9],[37,44.4],[44.5,47]],"중3":[[19.1,24.9],[25,32.9],[33,40.4],[40.5,48.4],[48.5,50]],"고1":[[25.5,28.9],[29,35.4],[35.5,42.4],[42.5,60.9],[61,62.5]],"고2":[[28.5,30.9],[31,38.9],[39,45.9],[46,60.9],[61,65]],"고3":[[30.5,30.9],[31,38.9],[39,45.9],[46,63.4],[63.5,68.4]]},
      "sprint50":{"초3":[[14.41,16.5],[11.01,14.4],[9.81,11.0],[9.01,9.8],[8.0,9.0]],"초4":[[13.21,16.0],[10.51,13.2],[9.71,10.5],[8.81,9.7],[7.7,8.8]],"초5":[[12.51,16.0],[10.21,12.5],[9.41,10.2],[8.51,9.4],[7.5,8.5]],"초6":[[12.51,15.5],[10.01,12.5],[9.11,10.0],[8.11,9.1],[7.11,8.1]],"중1":[[11.51,12.5],[9.31,11.5],[8.41,9.3],[7.51,8.4],[6.7,7.5]],"중2":[[11.51,12.4],[9.01,11.5],[8.21,9.0],[7.31,8.2],[6.5,7.3]],"중3":[[11.01,12.3],[8.51,11.0],[7.81,8.5],[7.01,7.8],[6.1,7.0]],"고1":[[10.01,10.74],[8.11,10.0],[7.61,8.1],[7.01,7.6],[6.1,7.0]],"고2":[[9.51,9.71],[7.91,9.5],[7.51,7.9],[6.71,7.5],[5.6,6.7]],"고3":[[8.71,9.61],[7.91,8.7],[7.51,7.9],[6.71,7.5],[5.6,6.7]]},
      "standjump":{"초3":[[91.8,100],[100.1,127],[127.1,141],[141.1,166],[166.1,171.4]],"초4":[[98.2,100],[100.1,130],[130.1,149],[149.1,170],[170.1,179.4]],"초5":[[105.6,111],[111.1,141],[141.1,158],[158.1,180],[180.1,187.4]],"초6":[[112,122],[122.1,148],[148.1,167],[167.1,200],[200.1,204.7]],"중1":[[122.9,131],[131.1,159],[159.1,177],[177.1,211],[211.1,219.7]],"중2":[[129.9,136],[136.1,169],[169.1,187],[187.1,218],[218.1,224.5]],"중3":[[141.4,145],[145.1,180],[180.1,201],[201.1,238],[238.1,244]],"고1":[[159.9,160],[160.1,195],[195.1,216],[216.1,255],[255.1,260.2]],"고2":[[162.9,177],[177.1,212],[212.1,228],[228.1,258],[258.1,270.1]],"고3":[[169.9,185],[185.1,221],[221.1,243],[243.1,264],[264.1,277]]}
    },
    "girls": {
      "shuttle":{"초3":[[14,18],[19,34],[35,50],[51,68],[69,98]],"초4":[[16,20],[21,39],[40,56],[57,76],[77,100]],"초5":[[18,22],[23,44],[45,62],[63,84],[85,104]],"초6":[[20,24],[25,49],[50,68],[69,92],[93,112]],"중1":[[10,13],[14,18],[19,24],[25,34],[35,70]],"중2":[[10,14],[15,20],[21,28],[29,39],[40,75]],"중3":[[12,15],[16,22],[23,32],[33,44],[45,79]],"고1":[[13,16],[17,24],[25,36],[37,49],[50,80]],"고2":[[14,17],[18,26],[27,40],[41,54],[55,81]],"고3":[[14,17],[18,26],[27,40],[41,54],[55,82]]},
      "longrun":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[[502,640],[442,501],[360,441],[300,359],[268,299]],"초6":[[480,587],[430,479],[354,429],[300,353],[243,299]],"중1":[[609,661],[518,608],[443,517],[380,442],[355,379]],"중2":[[609,661],[518,608],[443,517],[380,442],[355,379]],"중3":[[609,661],[518,608],[443,517],[380,442],[355,379]],"고1":[[609,661],[518,608],[443,517],[380,442],[365,379]],"고2":[[609,661],[518,608],[443,517],[380,442],[365,379]],"고3":[[609,661],[518,608],[443,517],[380,442],[365,379]]},
      "step":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[[44,46.9],[47,51.9],[52,61.9],[62,75.9],[76,95]],"초6":[null,null,null,null,null],"중1":[null,null,null,null,null],"중2":[null,null,null,null,null],"중3":[null,null,null,null,null],"고1":[null,null,null,null,null],"고2":[null,null,null,null,null],"고3":[null,null,null,null,null]},
      "sitreach":{"초3":[[-0.1,0.9],[1,4.9],[5,6.9],[7,9.9],[10,22]],"초4":[[-0.1,0.9],[1,4.9],[5,6.9],[7,9.9],[10,22]],"초5":[[-0.1,0.9],[1,4.9],[5,6.9],[7,9.9],[10,22]],"초6":[[-0.1,1.9],[2,4.9],[5,9.9],[10,13.9],[14,26]],"중1":[[-0.1,1.9],[2,7.9],[8,10.9],[11,14.9],[15,28]],"중2":[[-0.1,1.9],[2,7.9],[8,10.9],[11,14.9],[15,28]],"중3":[[-0.1,1.9],[2,7.9],[8,10.9],[11,15.9],[16,28]],"고1":[[-0.1,1.9],[2,7.9],[8,10.9],[11,15.9],[16,28]],"고2":[[-0.1,4.9],[5,8.9],[9,11.9],[12,16.9],[17,28]],"고3":[[-0.1,4.9],[5,8.9],[9,11.9],[12,16.9],[17,28]]},
      "flextest":{"초3":[[0,4],[5,5],[6,6],[7,7],[8,8]],"초4":[null,null,null,null,null],"초5":[null,null,null,null,null],"초6":[null,null,null,null,null],"중1":[null,null,null,null,null],"중2":[null,null,null,null,null],"중3":[null,null,null,null,null],"고1":[null,null,null,null,null],"고2":[null,null,null,null,null],"고3":[null,null,null,null,null]},
      "kneepush":{"초3":[null,null,null,null,null],"초4":[null,null,null,null,null],"초5":[null,null,null,null,null],"초6":[null,null,null,null,null],"중1":[[0,5],[6,13],[14,23],[24,44],[45,50]],"중2":[[0,5],[6,13],[14,23],[24,39],[40,44]],"중3":[[0,5],[6,13],[14,23],[24,39],[40,44]],"고1":[[0,5],[6,13],[14,23],[24,39],[40,44]],"고2":[[0,8],[9,17],[18,29],[30,39],[40,44]],"고3":[[0,8],[9,17],[18,29],[30,39],[40,44]]},
      "crunch":{"초3":[[0,5],[6,12],[13,28],[29,52],[53,90]],"초4":[[0,5],[6,17],[18,28],[29,59],[60,90]],"초5":[[0,6],[7,22],[23,35],[36,59],[60,90]],"초6":[[0,6],[7,22],[23,42],[43,59],[60,90]],"중1":[[0,6],[7,21],[22,42],[43,57],[58,62]],"중2":[[0,6],[7,18],[19,38],[39,57],[58,62]],"중3":[[0,5],[6,16],[17,33],[34,51],[52,60]],"고1":[[0,3],[4,12],[13,29],[30,39],[40,50]],"고2":[[0,3],[4,12],[13,29],[30,39],[40,50]],"고3":[[0,3],[4,12],[13,29],[30,39],[40,50]]},
      "grip":{"초3":[[4.8,6.9],[7,10.9],[11,15.9],[16,28.9],[29,32.4]],"초4":[[8.5,10.4],[10.5,13.4],[13.5,17.9],[18,28.9],[29,33.6]],"초5":[[10.6,11.9],[12,15.4],[15.5,18.9],[19,28.9],[29,35]],"초6":[[10,13.9],[14,18.9],[19,21.9],[22,32.9],[33,39]],"중1":[[11.9,13.9],[14,18.9],[19,22.9],[23,35.9],[36,38]],"중2":[[13,13.9],[14,19.4],[19.5,25.4],[25.5,35.9],[36,38]],"중3":[[14.9,15.9],[16,19.4],[19.5,27.4],[27.5,35.9],[36,38]],"고1":[[16,16.4],[16.5,22.9],[23,28.9],[29,35.9],[36,38]],"고2":[[17.6,17.9],[18,24.9],[25,29.4],[29.5,37.4],[37.5,38.2]],"고3":[[17.6,17.9],[18,24.9],[25,29.4],[29.5,37.4],[37.5,38.2]]},
      "sprint50":{"초3":[[13.81,18.42],[11.61,13.8],[10.51,11.6],[9.81,10.5],[9.4,9.8]],"초4":[[13.31,18.42],[11.01,13.3],[10.41,11.0],[9.41,10.4],[9.3,9.4]],"초5":[[13.31,15.91],[10.71,13.3],[9.91,10.7],[8.91,9.9],[8.73,8.9]],"초6":[[12.91,15.91],[10.71,12.9],[9.81,10.7],[8.91,9.8],[8.66,8.9]],"중1":[[12.21,13.51],[10.51,12.2],[9.81,10.5],[8.81,9.8],[8.6,8.8]],"중2":[[12.21,13.51],[10.51,12.2],[9.81,10.5],[8.81,9.8],[8.6,8.8]],"중3":[[12.21,13.51],[10.51,12.2],[9.81,10.5],[8.81,9.8],[8.6,8.8]],"고1":[[12.21,13.51],[10.51,12.2],[9.81,10.5],[8.81,9.8],[8.6,8.8]],"고2":[[12.21,13.51],[10.51,12.2],[9.51,10.5],[8.81,9.5],[8.6,8.8]],"고3":[[12.21,13.51],[10.51,12.2],[9.51,10.5],[8.81,9.5],[8.6,8.8]]},
      "standjump":{"초3":[[87.4,92],[92.1,118],[118.1,129],[129.1,154],[154.1,156]],"초4":[[87.4,97],[97.1,119],[119.1,135],[135.1,161],[161.1,165.5]],"초5":[[89.3,100],[100.1,123],[123.1,139],[139.1,170],[170.1,175]],"초6":[[89.9,100],[100.1,127],[127.1,144],[144.1,175],[175.1,177.8]],"중1":[[89.9,100],[100.1,127],[127.1,144],[144.1,175],[175.1,180.5]],"중2":[[93.9,100],[100.1,127],[127.1,145],[145.1,183],[183.1,193]],"중3":[[94.9,100],[100.1,127],[127.1,145],[145.1,183],[183.1,193]],"고1":[[94.9,100],[100.1,131],[131.1,151],[151.1,186],[186.1,200]],"고2":[[94.9,100],[100.1,131],[131.1,151],[151.1,186],[186.1,200]],"고3":[[94.9,100],[100.1,131],[131.1,151],[151.1,186],[186.1,200]]}
    }
  };

  const PAPS_DATA = {
    cardio: {
      label: '심폐지구력',
      exercises: [
        { id:'shuttle',  name:'왕복 오래달리기 (셔틀런)', unit:'회',   icon:'fas fa-arrows-left-right' },
        { id:'longrun',  name:'오래달리기-걷기',           unit:'초',   icon:'fas fa-person-running'   },
        { id:'step',     name:'스텝검사',                  unit:'PEI',  icon:'fas fa-stairs'           }
      ]
    },
    flexibility: {
      label: '유연성',
      exercises: [
        { id:'sitreach', name:'앉아 윗몸 앞으로 굽히기 (좌전굴)', unit:'cm',  icon:'fas fa-person-booth' },
        { id:'flextest', name:'종합 유연성 검사',                  unit:'점',  icon:'fas fa-circle-nodes' }
      ]
    },
    strength: {
      label: '근력·근지구력',
      exercises: [
        { id:'pushup',   name:'팔굽혀펴기 / 무릎대고 팔굽혀펴기', unit:'회',  icon:'fas fa-hand' },
        { id:'crunch',   name:'윗몸 말아올리기 (크런치)',          unit:'회',  icon:'fas fa-person' },
        { id:'grip',     name:'악력',                              unit:'kg',  icon:'fas fa-grip' }
      ]
    },
    speed: {
      label: '순발력',
      exercises: [
        { id:'standjump', name:'제자리 멀리뛰기', unit:'cm',  icon:'fas fa-person-falling' },
        { id:'sprint50',  name:'50m 달리기',       unit:'초',  icon:'fas fa-stopwatch'      }
      ]
    },
    body: {
      label: '체지방·신체조성',
      exercises: [
        { id:'bmi', name:'BMI (체질량지수)', unit:'kg/m²', icon:'fas fa-weight-scale' }
      ]
    }
  };

  // State tracker for evaluated grades & inputs for each category
  const userPapsScores = {
    cardio: { id: null, score: null, gradeIdx: null },
    flexibility: { id: null, score: null, gradeIdx: null },
    strength: { id: null, score: null, gradeIdx: null },
    speed: { id: null, score: null, gradeIdx: null },
    body: { id: null, score: null, gradeIdx: null }
  };

  let selectedCat = null;
  let selectedExId = null;
  let selectedExUnit = null;

  /* ── 3. Application State Initializers ── */
  
  function initDays() {
    const month = parseInt(monthSelect.value);
    const prevDayVal = parseInt(daySelect.value) || 1;
    daySelect.innerHTML = '';
    
    // Determine days in selected month (2025 is not a leap year, Feb = 28 days)
    let maxDays = 31;
    if (month === 2) {
      maxDays = 28;
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDays = 30;
    }
    
    for (let d = 1; d <= maxDays; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = `${d}일`;
      daySelect.appendChild(opt);
    }
    
    // Restore or clamp selected day
    if (prevDayVal <= maxDays) {
      daySelect.value = prevDayVal;
    } else {
      daySelect.value = maxDays;
    }
  }

  /* ── 4. Calculation Functions ── */

  // Evaluation of BMI based on customized Excel rules
  function evalBmiStandard(bmi, gender, yearKey) {
    const genderKey = gender.includes('남') ? 'boys' : 'girls';
    const ageData = BMI_STANDARDS[genderKey]?.[yearKey];
    if (!ageData) return { cat: 'normal', name: '정상', color: '#22c55e', feedback: '연령에 따른 BMI 표준 데이터가 없습니다. 일반 성인 기준으로 판정합니다.' };

    function testRule(rule) {
      if (!rule) return false;
      if (rule.type === 'lte') return bmi <= rule.value;
      if (rule.type === 'gte') return bmi >= rule.value;
      if (rule.type === 'range') return bmi >= rule.min && bmi <= rule.max;
      return false;
    }

    if (testRule(ageData.underweight)) {
      return { cat: 'underweight', name: '저체중', color: '#60a5fa', feedback: '성장기 저체중 상태입니다. 골격근 성장을 위해 단백질 식단과 [근력 강화] 플랭크/푸쉬업 운동을 적극 추천합니다.' };
    }
    if (testRule(ageData.normal)) {
      return { cat: 'normal', name: '정상', color: '#22c55e', feedback: '정상 범위의 신체조성입니다. 현재의 균형 잡힌 상태를 지키기 위해 꾸준한 밸런스 트레이닝을 권장합니다.' };
    }
    if (testRule(ageData.overweight)) {
      return { cat: 'overweight', name: '과체중', color: '#f97316', feedback: '과체중 단계입니다. 칼로리 소비를 촉진하고 심폐 능력을 키우는 체지방 감소 유산소 코스를 연동해 수행하세요.' };
    }
    if (testRule(ageData.obese_mild)) {
      return { cat: 'obese_mild', name: '경도 비만', color: '#ef4444', feedback: '경도 비만 단계입니다. 급격한 고강도 운동은 무릎 관절에 무리를 줍니다. 저충격 점핑잭이나 플랭크부터 점진적으로 늘려가세요.' };
    }
    if (testRule(ageData.obese_severe)) {
      return { cat: 'obese_severe', name: '고도 비만', color: '#a855f7', feedback: '고도 비만 단계입니다. 심한 운동 대신 체중을 싣지 않는 가벼운 동작과 스트레칭, 식단 관리를 우선 병행하세요.' };
    }

    // Default Fallback
    if (bmi < 18.5) return { cat: 'underweight', name: '저체중', color: '#60a5fa', feedback: '저체중 상태입니다. 충분한 영양소 섭취와 웨이트 트레이닝이 필요합니다.' };
    if (bmi < 23) return { cat: 'normal', name: '정상', color: '#22c55e', feedback: '정상 체밀도입니다. 규칙적인 유산소 운동을 계속해 주세요.' };
    if (bmi < 25) return { cat: 'overweight', name: '과체중', color: '#f97316', feedback: '과체중입니다. 심폐지구력 위주의 운동량을 넓히세요.' };
    return { cat: 'obese_mild', name: '비만', color: '#ef4444', feedback: '비만 상태입니다. 관절에 무리가 가지 않는 걷기, 나비자세 훈련부터 출발하세요.' };
  }

  // PAPS evaluation function
  function evalPapsGrade(value, exId, yearKey, gender) {
    const genderKey = gender.includes('남') ? 'boys' : 'girls';
    const exKey = (genderKey === 'girls' && exId === 'pushup') ? 'kneepush' : exId;
    const exData = PAPS_GRADES[genderKey]?.[exKey];
    if (!exData) return null;
    const ranges = exData[yearKey];
    if (!ranges) return null;

    // Check bounds
    for (let i = 0; i < 5; i++) {
      const r = ranges[i];
      if (!r) continue;
      
      // Special logic for sprint50 (running seconds - lower is better)
      if (exId === 'sprint50' || exId === 'longrun') {
        if (value >= r[0] && value <= r[1]) {
          return { idx: i, range: r, ...GRADE_META[i] };
        }
      } else {
        if (value >= r[0] && value <= r[1]) {
          return { idx: i, range: r, ...GRADE_META[i] };
        }
      }
    }
    
    // Out of range fallbacks
    const valid = ranges.map((r,i) => ({r,i})).filter(x=>x.r);
    if (!valid.length) return null;
    const allMins = valid.map(x=>x.r[0]);
    const allMaxs = valid.map(x=>x.r[1]);
    const dataMin = Math.min(...allMins);
    const dataMax = Math.max(...allMaxs);
    
    // Reverse bounds check for timed runs (lower is better (1등급))
    if (exId === 'sprint50' || exId === 'longrun') {
      if (value > dataMax) return { idx: 0, range: null, ...GRADE_META[0], outOfRange: true };
      if (value < dataMin) return { idx: 4, range: null, ...GRADE_META[4], outOfRange: true };
    } else {
      if (value < dataMin) return { idx: 0, range: null, ...GRADE_META[0], outOfRange: true };
      if (value > dataMax) return { idx: 4, range: null, ...GRADE_META[4], outOfRange: true };
    }
    return null;
  }

  /* ── 5. Main UI Event Handlers ── */

  function updateBmi() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;

    const bmi = w / ((h / 100) ** 2);
    bmiValBadge.textContent = bmi.toFixed(2);
    
    const yearKey = AGE_TO_YEAR[age] || '고3';
    const classification = evalBmiStandard(bmi, gender, yearKey);

    // Position pin on bar
    const percent = Math.max(0, Math.min(100, ((bmi - 10) / (35 - 10)) * 100));
    bmiPin.style.left = `${percent}%`;
    bmiPin.innerHTML = `▲ 내 BMI (${bmi.toFixed(2)}) - <span style="color: ${classification.color}">${classification.name}</span>`;

    // Feedback
    bmiFeedback.textContent = classification.feedback;
    bmiFeedback.style.borderLeftColor = classification.color;
  }

  function updateDetox() {
    const hours = parseFloat(screenTimeIn.value);
    screenTimeVal.textContent = `${hours}시간`;

    // 15% Screen Time detox targets
    const detoxMinutes = Math.round(hours * 60 * 0.15);
    targetTime.textContent = `${detoxMinutes}분`;

    const shieldHP = Math.round(detoxMinutes * 1.8);
    targetShield.textContent = `${shieldHP} HP`;

    // Risk indicator
    let riskText = "주의 단계";
    let riskColor = "var(--warn-glow)";
    if (hours < 3) {
      riskText = "안전 단계";
      riskColor = "var(--success-glow)";
    } else if (hours >= 7) {
      riskText = "중독 위험 🚨";
      riskColor = "var(--danger-glow)";
    } else if (hours >= 5) {
      riskText = "위험 단계";
      riskColor = "var(--danger-glow)";
    }
    riskAlert.textContent = riskText;
    riskAlert.style.color = riskColor;

    // Dial offset
    const dialPercent = Math.min(100, (hours / 12) * 100);
    const strokeDash = 283 - (283 * dialPercent) / 100;
    circleProgress.style.strokeDashoffset = strokeDash;
  }

  function updateWeather() {
    const m = monthSelect.value;
    const d = daySelect.value;
    const key = `${m}-${d}`;
    const data = WEATHER_DATA[key];

    if (!data) return;

    // Update display values
    tempDisp.textContent = data.temp;
    humDisp.textContent = data.humidity;
    windDisp.textContent = data.wind;
    
    // Rain rendering (NEW)
    const rainVal = data.rain !== undefined ? data.rain : 0.0;
    rainDisp.textContent = rainVal;
    
    let rainText = "비 안옴 ☀️";
    let rainColor = "var(--text-muted)";
    if (rainVal > 0) {
      if (rainVal < 3.0) {
        rainText = "가랑비 🌧️";
        rainColor = "#60a5fa";
      } else if (rainVal <= 10.0) {
        rainText = "보통 비 🌧️";
        rainColor = "#3b82f6";
      } else {
        rainText = "폭우 🚨";
        rainColor = "var(--danger-glow)";
      }
    }
    rainStatDisp.textContent = rainText;
    rainStatDisp.style.color = rainColor;
    rainIcon.style.color = rainColor;

    // Temperature Status Badge (Replacing "대기 중")
    let tempText = "쾌적 😊";
    let tempColor = "var(--success-glow)";
    if (data.temp < 10) {
      tempText = "추움 ❄️";
      tempColor = "#60a5fa";
    } else if (data.temp < 18) {
      tempText = "쌀쌀함 🍃";
      tempColor = "var(--primary-glow)";
    } else if (data.temp > 33) {
      tempText = "폭염 🚨";
      tempColor = "var(--danger-glow)";
    } else if (data.temp > 25) {
      tempText = "더움 ☀️";
      tempColor = "var(--warn-glow)";
    }
    const tempStatDisp = document.getElementById('weatherTempStatus');
    tempStatDisp.textContent = tempText;
    tempStatDisp.style.color = tempColor;

    // Humidity Status Badge (Replacing "대기 중")
    let humText = "쾌적 💧";
    let humColor = "var(--success-glow)";
    if (data.humidity < 30) {
      humText = "건조 🌵";
      humColor = "var(--warn-glow)";
    } else if (data.humidity > 80) {
      humText = "다습 💦";
      humColor = "var(--danger-glow)";
    } else if (data.humidity > 60) {
      humText = "습함 ☁️";
      humColor = "var(--primary-glow)";
    }
    const humStatDisp = document.getElementById('weatherHumStatus');
    humStatDisp.textContent = humText;
    humStatDisp.style.color = humColor;

    // Wind Status Badge (Replacing "대기 중")
    let windText = "잔잔함 🍃";
    let windColor = "var(--text-muted)";
    if (data.wind > 8.0) {
      windText = "돌풍 🚨";
      windColor = "var(--danger-glow)";
    } else if (data.wind > 5.0) {
      windText = "강풍 🌪️";
      windColor = "var(--warn-glow)";
    } else if (data.wind >= 2.0) {
      windText = "쾌적 💨";
      windColor = "var(--primary-glow)";
    }
    const windStatDisp = document.getElementById('weatherWindStatus');
    windStatDisp.textContent = windText;
    windStatDisp.style.color = windColor;
    
    // Dust and UV
    dustValDisp.textContent = `${data.dust} ㎍/㎥`;
    dustStatDisp.textContent = data.dust_desc;
    
    uvValDisp.textContent = data.uv;
    uvStatDisp.textContent = data.uv_desc;

    // Dust color Highlights
    if (data.dust_desc === '좋음') {
      dustStatDisp.style.color = 'var(--success-glow)';
      dustIcon.style.color = 'var(--success-glow)';
    } else if (data.dust_desc === '보통') {
      dustStatDisp.style.color = 'var(--primary-glow)';
      dustIcon.style.color = 'var(--primary-glow)';
    } else if (data.dust_desc === '나쁨') {
      dustStatDisp.style.color = 'var(--warn-glow)';
      dustIcon.style.color = 'var(--warn-glow)';
    } else {
      dustStatDisp.style.color = 'var(--danger-glow)';
      dustIcon.style.color = 'var(--danger-glow)';
    }

    // UV color Highlights
    if (data.uv_desc === '낮음') {
      uvStatDisp.style.color = 'var(--success-glow)';
      uvIcon.style.color = 'var(--success-glow)';
    } else if (data.uv_desc === '보통') {
      uvStatDisp.style.color = 'var(--primary-glow)';
      uvIcon.style.color = 'var(--primary-glow)';
    } else if (data.uv_desc === '높음') {
      uvStatDisp.style.color = 'var(--warn-glow)';
      uvIcon.style.color = 'var(--warn-glow)';
    } else {
      uvStatDisp.style.color = 'var(--danger-glow)';
      uvIcon.style.color = 'var(--danger-glow)';
    }

    // Calculate Suitability Score
    let score = 100;
    
    // Temperature deductions
    if (data.temp > 33) {
      score -= (data.temp - 33) * 6;
    } else if (data.temp < 10) {
      score -= (10 - data.temp) * 3;
    }
    
    // Humidity deductions
    if (data.humidity > 80) {
      score -= (data.humidity - 80) * 1.5;
    } else if (data.humidity < 25) {
      score -= (25 - data.humidity) * 0.5;
    }

    // Dust deductions
    if (data.dust_desc === '보통') score -= 8;
    else if (data.dust_desc === '나쁨') score -= 30;
    else if (data.dust_desc === '매우 나쁨') score -= 60;

    // Wind deductions
    if (data.wind > 8) {
      score -= (data.wind - 8) * 4;
    }

    // UV deductions
    if (data.uv_desc === '높음') score -= 10;
    else if (data.uv_desc === '매우 높음') score -= 25;
    else if (data.uv_desc === '위험') score -= 45;

    // Precipitation (Rain) deductions (NEW)
    if (rainVal > 0) {
      if (rainVal < 3.0) {
        score -= 25;
      } else if (rainVal <= 10.0) {
        score -= 60;
      } else {
        score -= 95;
      }
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    suitScore.textContent = `${score}점`;

    // Suitability Badge
    let suitText = "야외 운동 최적 ☀️";
    let suitColor = 'var(--success-glow)';
    let suitBg = 'rgba(16, 185, 129, 0.08)';
    let suitBorder = 'rgba(16, 185, 129, 0.2)';
    let advice = "대기가 맑고 기온이 쾌적합니다. 밖에서 활기차게 유산소 훈련을 진행해 보세요!";

    const isWeatherGood = (
      data.temp >= 15.0 && data.temp <= 26.0 &&
      data.humidity >= 35.0 && data.humidity <= 65.0 &&
      (data.dust_desc === '좋음' || data.dust_desc === '보통') &&
      (data.uv_desc === '낮음' || data.uv_desc === '보통') &&
      rainVal === 0.0 &&
      data.wind <= 4.0
    );

    if (isWeatherGood) {
      suitText = "야외 활동 최적 (날씨 좋음) 🌿";
      suitColor = 'var(--success-glow)';
      suitBg = 'rgba(16, 185, 129, 0.12)';
      suitBorder = 'var(--success-glow)';
      advice = "현재 기온, 습도, 대기 질, 바람 등 모든 날씨 조건이 완벽합니다! 밖으로 나가 가볍게 야외 유산소 운동이나 공원 스트레칭을 즐겨보세요. 최고의 운동 효과를 기대할 수 있는 날씨입니다!";
    } else if (score < 40) {
      suitText = "실내 대체 권장 🚨";
      suitColor = 'var(--danger-glow)';
      suitBg = 'rgba(239, 68, 68, 0.08)';
      suitBorder = 'rgba(239, 68, 68, 0.2)';
      
      if (rainVal > 0) {
        advice = `비가 내리고 있습니다 (${rainVal}mm). 노면이 미끄러워 부상 위험이 크고 감기 위험이 있으니 야외 운동을 중단하시고, 실내에서 홈 트레이닝(매트 스쿼트, 크런치, 플랭크)을 하세요.`;
      } else if (data.dust_desc === '나쁨' || data.dust_desc === '매우 나쁨') {
        advice = "미세먼지 농도가 매우 나쁩니다. 무리한 야외 운동은 오히려 폐 건강을 해치므로 피하시고, 창문을 닫고 실내에서 코어 근력 운동(플랭크, 크런치 등)을 진행하세요.";
      } else if (data.uv_desc === '위험' || data.uv_desc === '매우 높음') {
        advice = "자외선 세기가 극도로 높아 화상 및 열사병 우려가 있습니다. 실외 훈련을 삼가고 자외선이 완전 차단된 실내 훈련을 하세요.";
      } else if (data.temp > 33) {
        advice = "폭염 경보 상황입니다. 야외 운동은 탈수와 열사병을 유발하므로 냉방이 확보된 실내 체육관이나 집안에서 유연성 스트레칭을 주로 가볍게 하세요.";
      } else {
        advice = "기상 악화로 야외 운동에 부적합합니다. 안전한 실내 대체 운동(점핑잭, 플랭크 등)을 선택하여 체력을 보강하세요.";
      }
    } else if (score < 70) {
      suitText = "주의 요망 ⛅";
      suitColor = 'var(--warn-glow)';
      suitBg = 'rgba(245, 158, 11, 0.08)';
      suitBorder = 'rgba(245, 158, 11, 0.2)';
      
      if (rainVal > 0) {
        advice = `약간의 비가 날리고 있습니다 (${rainVal}mm). 야외 활동 시 미끄러짐에 주의하시고 가벼운 우비를 쓰거나 우산 산책, 혹은 체육관 실내 조깅을 추천합니다.`;
      } else if (data.uv_desc === '높음') {
        advice = "자외선 지수가 다소 높으므로 야외 러닝을 할 때는 자외선 차단제를 바르고 모자를 착용하세요. 그늘진 코스를 위주로 훈련할 것을 추천합니다.";
      } else if (data.dust_desc === '보통') {
        advice = "대기 상태가 보통 수준입니다. 호흡기가 예민하시다면 실외 운동 시간을 줄이거나 마스크를 착용하고 가볍게 조깅하세요.";
      } else if (data.wind > 5) {
        advice = "바람이 다소 강하게 불어 러닝 시 저항이 높습니다. 바람을 등지고 뛰거나, 바람이 차단된 실내 훈련을 병행해 보세요.";
      } else {
        advice = "야외 운동 시 다소 불편할 수 있으니 준비 운동을 충분히 하시고 몸 상태에 귀를 기울이세요.";
      }
    }

    suitStatus.textContent = suitText;
    suitStatus.style.color = suitColor;
    suitStatus.style.background = suitColor.replace(')', ',0.15)').replace('rgb', 'rgba') || 'rgba(245, 158, 11, 0.15)';
    
    weatherBanner.style.background = suitBg;
    weatherBanner.style.borderColor = suitBorder;
    suitScore.style.color = suitColor;
    
    weatherAdvice.textContent = advice;
  }

  // Real-time Fitness HUD Dashboard Updates
  function updateDashboard() {
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    const yearKey = AGE_TO_YEAR[age] || '고3';

    // 1. BMI Dashboard Item
    let bmiVal = w / ((h / 100) ** 2);
    let bmiClass = evalBmiStandard(bmiVal, gender, yearKey);

    // If explicit PAPS body score exists, override!
    if (userPapsScores.body && userPapsScores.body.score !== null) {
      bmiVal = userPapsScores.body.score;
      if (userPapsScores.body.gradeText) {
        bmiClass = {
          name: userPapsScores.body.gradeText,
          color: userPapsScores.body.color,
          cat: userPapsScores.body.gradeText === '저체중' ? 'underweight' :
               userPapsScores.body.gradeText === '정상' ? 'normal' :
               userPapsScores.body.gradeText === '과체중' ? 'overweight' :
               userPapsScores.body.gradeText === '경도 비만' ? 'obese_mild' : 'obese_severe'
        };
      }
    }
    
    dashBodyVal.textContent = `BMI: ${bmiVal.toFixed(2)} (${bmiClass.name})`;
    dashBodyGrade.textContent = bmiClass.name;
    dashBodyGrade.style.color = bmiClass.color;
    
    // Position BMI fill bar
    const bmiPct = Math.max(10, Math.min(100, ((bmiVal - 10) / (35 - 10)) * 100));
    dashBodyFill.style.width = `${bmiPct}%`;
    dashBodyFill.style.backgroundColor = bmiClass.color;
    dashBodyFill.style.boxShadow = `0 0 10px ${bmiClass.color}`;
    
    // 2. PAPS Categories Dashboard Items
    const cats = ['cardio', 'flexibility', 'strength', 'speed'];
    cats.forEach(cat => {
      const item = userPapsScores[cat];
      const valEl = document.getElementById(`dash${cat.charAt(0).toUpperCase() + cat.slice(1)}Val`);
      const fillEl = document.getElementById(`dash${cat.charAt(0).toUpperCase() + cat.slice(1)}Fill`);
      const gradeEl = document.getElementById(`dash${cat.charAt(0).toUpperCase() + cat.slice(1)}Grade`);
      
      if (item && item.gradeIdx !== null && item.score !== null) {
        const meta = GRADE_META[item.gradeIdx];
        const exName = PAPS_DATA[cat].exercises.find(e => e.id === item.id)?.name || '';
        const shortExName = exName.split('(')[0].trim();
        valEl.textContent = `${shortExName}: ${item.score}${PAPS_DATA[cat].exercises.find(e => e.id === item.id)?.unit || ''}`;
        
        // Progress bar percentage (1등급 = 100%, 5등급 = 20%)
        const pct = (item.gradeIdx + 1) * 20;
        fillEl.style.width = `${pct}%`;
        fillEl.style.backgroundColor = meta.color;
        fillEl.style.boxShadow = `0 0 10px ${meta.color}`;
        
        gradeEl.textContent = `${meta.stars} ${meta.label} (${meta.name})`;
        gradeEl.style.color = meta.color;
      } else {
        valEl.textContent = "미측정";
        fillEl.style.width = "0%";
        fillEl.style.backgroundColor = "var(--text-muted)";
        fillEl.style.boxShadow = "none";
        gradeEl.textContent = "—";
        gradeEl.style.color = "var(--text-muted)";
      }
    });
  }

  // Generate Personalized Recommendations based on Weather, PAPS weakness, and BMI
  function updateRecommendations() {
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    const yearKey = AGE_TO_YEAR[age] || '고3';

    // Get current weather status
    const m = monthSelect.value;
    const d = daySelect.value;
    const key = `${m}-${d}`;
    const weather = WEATHER_DATA[key];
    
    // Check if outdoor is okay: no heavy rain, no freezing cold/scalding heat, no toxic dust/UV
    const rainVal = weather ? (weather.rain !== undefined ? weather.rain : 0.0) : 0.0;
    const isOutdoorOk = weather ? (weather.temp >= 5 && weather.temp <= 33 && weather.dust_desc !== '나쁨' && weather.dust_desc !== '매우 나쁨' && weather.uv_desc !== '위험' && rainVal === 0.0) : true;

    // Check if weather is GOOD (ideal pleasant weather)
    const isWeatherGood = weather ? (
      weather.temp >= 15.0 && weather.temp <= 26.0 &&
      weather.humidity >= 35.0 && weather.humidity <= 65.0 &&
      (weather.dust_desc === '좋음' || weather.dust_desc === '보통') &&
      (weather.uv_desc === '낮음' || weather.uv_desc === '보통') &&
      rainVal === 0.0 &&
      weather.wind <= 4.0
    ) : false;

    // Calculate PAPS Base Difficulty
    let totalGradeIdx = 0;
    let gradedCount = 0;
    let weakestCategory = 'cardio';
    let lowestGrade = 999;

    for (const cat in userPapsScores) {
      if (cat === 'body') continue; // Only count standard PAPS physical categories
      const item = userPapsScores[cat];
      if (item && item.gradeIdx !== null && item.score !== null) {
        gradedCount++;
        totalGradeIdx += item.gradeIdx; // 0 (5등급) to 4 (1등급)
        if (item.gradeIdx < lowestGrade) {
          lowestGrade = item.gradeIdx;
          weakestCategory = cat;
        }
      }
    }

    // Determine PAPS Base Level
    let baseLevel = '중';
    if (gradedCount > 0) {
      const avgGradeIdx = totalGradeIdx / gradedCount;
      if (avgGradeIdx < 1.5) {
        baseLevel = '하';
      } else if (avgGradeIdx >= 3.0) {
        baseLevel = '상';
      } else {
        baseLevel = '중';
      }
    } else {
      // Default weakness pill matches active pill if no inputs provided
      if (selectedCat && selectedCat !== 'body') {
        weakestCategory = selectedCat;
      }
      baseLevel = '중';
    }

    // Determine BMI Classification
    let bmiVal = w / ((h / 100) ** 2);
    if (userPapsScores.body && userPapsScores.body.score !== null) {
      bmiVal = userPapsScores.body.score;
    }
    const bmiClass = evalBmiStandard(bmiVal, gender, yearKey);

    // Dynamic Joint-Safety Difficulty Tuning (Combined PAPS & BMI)
    let combinedDifficulty = baseLevel;
    let safetyTriggered = false;
    let safetyReason = "";

    if (bmiClass.cat === 'obese_severe') {
      combinedDifficulty = '하';
      safetyTriggered = true;
      safetyReason = "고도 비만 판정으로 관절 과부하 방지 및 슬관절 보호를 위해 [하] 기초 강도 강제 고정";
    } else if (bmiClass.cat === 'obese_mild') {
      if (baseLevel === '상') {
        combinedDifficulty = '중';
        safetyTriggered = true;
        safetyReason = "경도 비만 판정으로 과도한 착지 충격을 예방하고자 [중] 일반 강도로 안전 하향";
      } else if (baseLevel === '중') {
        combinedDifficulty = '하';
        safetyTriggered = true;
        safetyReason = "경도 비만 판정으로 안전한 기초 다지기를 위해 [하] 기초 강도로 권장 하향";
      }
    } else if (bmiClass.cat === 'overweight' || bmiClass.cat === 'underweight') {
      if (baseLevel === '상') {
        combinedDifficulty = '중';
        safetyTriggered = true;
        safetyReason = "체성분 균형 조절을 위해 [중] 일반 강도로 조정";
      }
    }

    // Render Neon Recommendation HUD Title & Info
    const recHudPanel = document.getElementById('recommendationPanel');
    const safetyBadge = safetyTriggered ? `<span class="tech-badge" style="background: rgba(245,158,11,0.15); color: var(--warn-glow); border-color: rgba(245,158,11,0.3); font-size:0.68rem; padding: 0.15rem 0.4rem; display:inline-flex; align-items:center; gap:0.25rem;"><i class="fas fa-user-shield"></i> 관절 세이프가드 작동</span>` : '';
    const safetyReasonText = safetyTriggered ? `<p style="font-size:0.75rem; color: var(--warn-glow); margin-top:0.35rem;"><i class="fas fa-info-circle"></i> 조치 원인: ${safetyReason}</p>` : '';
    
    let hudHtml = `
      <div class="panel-header-hud" style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.75rem; margin-bottom:1.25rem;">
        <h2 class="panel-title" style="border:none; padding:0; margin:0;"><i class="fas fa-running"></i> 실시간 스마트 맞춤형 운동 처방 카드</h2>
      </div>
      <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0.9rem 1.25rem; margin-bottom: 1.25rem; box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-size: 0.83rem; font-weight:700; color:var(--text-muted);">PAPS & BMI 연동 최종 권장 강도</span>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.05rem; font-weight:800; color: ${combinedDifficulty === '상' ? 'var(--danger-glow)' : (combinedDifficulty === '중' ? 'var(--warn-glow)' : 'var(--success-glow)')}; text-shadow: 0 0 6px ${combinedDifficulty === '상' ? 'rgba(239,68,68,0.2)' : (combinedDifficulty === '중' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)')};">
              ${combinedDifficulty === '상' ? '상 (고강도)' : (combinedDifficulty === '중' ? '중 (일반강도)' : '하 (기초강도)')}
            </span>
            ${safetyBadge}
          </div>
        </div>
        ${safetyReasonText}
      </div>
    `;

    const originalTitle = recHudPanel.querySelector('.panel-title');
    const existingHud = recHudPanel.querySelector('.panel-header-hud');
    if (existingHud) {
      existingHud.nextElementSibling.outerHTML = hudHtml.split('</div>')[1] + '</div>';
    } else if (originalTitle) {
      originalTitle.outerHTML = hudHtml;
    }

    // Select PAPS Exercise based on combinedDifficulty
    const papsExerciseList = EXERCISE_LIBRARY[weakestCategory].items;
    let papsExercise = papsExerciseList.find(x => x.level === combinedDifficulty && !x.outdoor)
                    || papsExerciseList.find(x => !x.outdoor)
                    || papsExerciseList[0];

    // Select BMI custom exercise based on combinedDifficulty
    let bmiRecTitle = '';
    let bmiRecName = '';
    let bmiRecDesc = '';
    let bmiRecDuration = '';

    if (bmiClass.cat === 'underweight') {
      bmiRecTitle = "근력·근지구력 강화";
      const item = EXERCISE_LIBRARY['strength'].items.find(x => x.level === combinedDifficulty && !x.outdoor) || EXERCISE_LIBRARY['strength'].items.find(x => x.level === '하' && !x.outdoor);
      bmiRecName = item.name;
      bmiRecDesc = `저체중 상태 극복을 위해 기초 대사와 골격근 성장을 촉진시키는 [${item.name}]을 추천합니다. 근 비대와 근원섬유 성장을 돕는 타겟 동작입니다. ${item.desc}`;
      bmiRecDuration = item.duration;
    } else if (bmiClass.cat === 'normal') {
      bmiRecTitle = "코어 및 유연성 밸런스";
      const item = EXERCISE_LIBRARY['flexibility'].items.find(x => x.level === combinedDifficulty && !x.outdoor) || EXERCISE_LIBRARY['flexibility'].items.find(x => x.level === '하' && !x.outdoor);
      bmiRecName = item.name;
      bmiRecDesc = `건강한 척추 정렬과 골반 좌우 대칭을 회복하기 위한 밸런스 스트레칭 코스 [${item.name}]을 추천합니다. ${item.desc}`;
      bmiRecDuration = item.duration;
    } else {
      bmiRecTitle = "체지방 적극 연소 코스";
      const item = EXERCISE_LIBRARY['body'].items.find(x => x.level === combinedDifficulty && !x.outdoor) || EXERCISE_LIBRARY['body'].items.find(x => x.level === '하' && !x.outdoor);
      bmiRecName = item.name;
      bmiRecDesc = `체지방 소모 효율이 극대화된 전신 칼로리 연소 동작 [${item.name}]을 진행하여 불필요한 지방 축적량을 적극 줄여보세요. ${item.desc}`;
      bmiRecDuration = item.duration;
    }

    // Select Weather exercise based on combinedDifficulty
    let weatherRecTitle = '';
    let weatherRecName = '';
    let weatherRecDesc = '';
    let weatherRecDiff = combinedDifficulty;
    let weatherRecDuration = '';
    
    if (isOutdoorOk) {
      const outdoorItem = EXERCISE_LIBRARY[weakestCategory].items.find(x => x.outdoor);
      if (isWeatherGood && outdoorItem) {
        weatherRecTitle = `🌿 야외 추천 (${EXERCISE_LIBRARY[weakestCategory].name} 코스)`;
        weatherRecName = outdoorItem.name;
        weatherRecDesc = `바람, 기온, 습도가 모두 완벽한 '야외 운동 최적'의 기상 환경입니다! 당장 밖으로 나가 상쾌한 야외 공기와 함께 [${outdoorItem.name}] 훈련을 즐겨보세요! ${outdoorItem.desc}`;
        weatherRecDiff = '야외';
        weatherRecDuration = outdoorItem.duration;
      } else if (outdoorItem) {
        const papsLabel = EXERCISE_LIBRARY[weakestCategory].name;
        weatherRecTitle = `☀️ 야외 ${papsLabel} 코스`;
        weatherRecName = outdoorItem.name;
        weatherRecDesc = `오늘의 야외 대기 환경이 양호합니다. 밖에서 자연 공기를 쐬며 [${outdoorItem.name}] 훈련을 즐겁게 수행해 보세요! ${outdoorItem.desc}`;
        weatherRecDiff = '야외';
        weatherRecDuration = outdoorItem.duration;
      } else {
        weatherRecTitle = "☀️ 기상 적합 야외 유산소";
        const item = EXERCISE_LIBRARY['cardio'].items.find(x => x.level === combinedDifficulty && !x.outdoor) || EXERCISE_LIBRARY['cardio'].items.find(x => x.level === '하' && !x.outdoor);
        weatherRecName = item.name;
        weatherRecDesc = `맑고 온화한 대기 환경에서 야외 페이스 러닝을 즐기기에 완벽한 시점입니다. [${item.name}]으로 폐활량을 단련해 보세요. ${item.desc}`;
        weatherRecDuration = item.duration;
      }
    } else {
      weatherRecTitle = "🏠 기상 악화 대체 실내 유산소";
      const item = EXERCISE_LIBRARY['body'].items.find(x => x.level === combinedDifficulty && !x.outdoor) || EXERCISE_LIBRARY['body'].items.find(x => x.level === '하' && !x.outdoor);
      weatherRecName = item.name;
      weatherRecDesc = `눈/비, 미세먼지 혹은 강한 자외선 탓에 야외 활동 시 부상 및 감기 위험이 큽니다. 창문을 닫고 안전한 실내에서 [${item.name}]으로 땀을 내보세요. ${item.desc}`;
      weatherRecDuration = item.duration;
    }

    // Build Cards HTML
    const weaknessLabel = EXERCISE_LIBRARY[weakestCategory].name;
    const weakestScoreObj = userPapsScores[weakestCategory];
    let weaknessStatusText = "기초 체력 증진";
    
    if (weakestScoreObj && weakestScoreObj.score !== null) {
      const papsExUnit = PAPS_DATA[weakestCategory].exercises.find(e => e.id === weakestScoreObj.id)?.unit || '';
      weaknessStatusText = `${weakestScoreObj.score}${papsExUnit} (등급: ${weakestScoreObj.gradeText || (weakestScoreObj.gradeIdx + 1 + '등급')})`;
    }

    let papsCardDesc = papsExercise.desc;
    if (weakestScoreObj && weakestScoreObj.score !== null) {
      papsCardDesc = `내 측정 수치인 **${weaknessStatusText}**를 기반으로 약한 체력 요소를 집중 보완하기 위한 [${papsExercise.name}]을 추천합니다. ${papsExercise.desc}`;
    } else {
      papsCardDesc = `대시보드에 아직 측정된 PAPS 기록이 없습니다. 기초 체력 자가 진단 및 취약 부위 분석을 위해 PAPS 측정 수치를 기록해주세요. 초기 단련을 위해 [${papsExercise.name}]을 권장합니다.`;
    }

    const papsOutdoorBadge = (isOutdoorOk && papsExercise.outdoor) ? ' 🌿 야외' : '';
    
    let html = `
      <!-- PAPS Card -->
      <div class="recommend-card paps-card" style="${weakestScoreObj ? 'border-color: var(--primary-glow); box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);' : ''}">
        <div class="card-header-row">
          <span class="card-tag">PAPS 보완 (${weaknessLabel} 단련${papsOutdoorBadge})</span>
          <span style="display:flex; gap:0.4rem; align-items:center;">
            <span class="card-difficulty-badge"><i class="far fa-clock"></i> ⏱️ ${papsExercise.duration}</span>
            <span class="card-difficulty-badge">난이도: ${papsExercise.level}</span>
          </span>
        </div>
        <h4 class="card-title-text">${papsExercise.name}</h4>
        <p class="card-desc-text">${papsCardDesc}</p>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
          <i class="fas fa-chart-line" style="color:var(--primary-glow);"></i> 분석 기반: ${weaknessStatusText}
        </div>
        <div style="margin-top:0.75rem; display:flex; align-items:center; gap:0.5rem;">
          <input type="checkbox" id="chkPaps" class="exercise-checkbox" style="width:18px; height:18px; cursor:pointer;">
          <label for="chkPaps" style="cursor:pointer; color:var(--text-light); text-transform:none; font-size:0.83rem;">오늘의 보완 운동 완료</label>
        </div>
      </div>

      <!-- BMI Card -->
      <div class="recommend-card bmi-card" style="border-color: ${bmiClass.color}; box-shadow: 0 0 10px ${bmiClass.color}25;">
        <div class="card-header-row">
          <span class="card-tag">BMI 맞춤 (${bmiClass.name} 조절)</span>
          <span style="display:flex; gap:0.4rem; align-items:center;">
            <span class="card-difficulty-badge"><i class="far fa-clock"></i> ⏱️ ${bmiRecDuration}</span>
            <span class="card-difficulty-badge">난이도: ${combinedDifficulty}</span>
          </span>
        </div>
        <h4 class="card-title-text">${bmiRecName}</h4>
        <p class="card-desc-text">내 현재 BMI **${bmiVal.toFixed(2)} (${bmiClass.name})** 상태에 딱 맞는 맞춤형 처방입니다. ${bmiRecDesc}</p>
        <div style="margin-top:0.75rem; display:flex; align-items:center; gap:0.5rem;">
          <input type="checkbox" id="chkBmi" class="exercise-checkbox" style="width:18px; height:18px; cursor:pointer;">
          <label for="chkBmi" style="cursor:pointer; color:var(--text-light); text-transform:none; font-size:0.83rem;">오늘의 조절 운동 완료</label>
        </div>
      </div>

      <!-- Weather Card -->
      <div class="recommend-card weather-card" style="${isWeatherGood ? 'border-color: var(--success-glow); box-shadow: 0 0 12px rgba(16, 185, 129, 0.35); border-width: 2px;' : ''}">
        <div class="card-header-row">
          <span class="card-tag" style="${isWeatherGood ? 'background: rgba(16, 185, 129, 0.25); border: 1px solid var(--success-glow); font-weight: 900;' : ''}">${weatherRecTitle}</span>
          <span style="display:flex; gap:0.4rem; align-items:center;">
            <span class="card-difficulty-badge"><i class="far fa-clock"></i> ⏱️ ${weatherRecDuration}</span>
            <span class="card-difficulty-badge">난이도: ${weatherRecDiff}</span>
          </span>
        </div>
        <h4 class="card-title-text">${weatherRecName}</h4>
        <p class="card-desc-text">${weatherRecDesc}</p>
        <div style="margin-top:0.75rem; display:flex; align-items:center; gap:0.5rem;">
          <input type="checkbox" id="chkWeather" class="exercise-checkbox" style="width:18px; height:18px; cursor:pointer;">
          <label for="chkWeather" style="cursor:pointer; color:var(--text-light); text-transform:none; font-size:0.83rem;">오늘의 날씨 코스 완료</label>
        </div>
      </div>
    `;

    exerciseContainer.innerHTML = html;

    // Attach listeners to checkboxes
    document.querySelectorAll('.exercise-checkbox').forEach(chk => {
      chk.addEventListener('change', updateShieldProgress);
    });

    updateShieldProgress(); // Reset progress bar
    updateDashboard(); // Run Dashboard Updates concurrently
  }

  function updateShieldProgress() {
    const chks = document.querySelectorAll('.exercise-checkbox');
    let checkedCount = 0;
    chks.forEach(c => {
      if (c.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / 3) * 100);
    progressPercent.textContent = `${percent}% 충전됨`;
    detoxProgressFill.style.width = `${percent}%`;
  }

  /* ── 6. Setup PAPS Input Grade Listeners ── */

  function setupPapsListeners() {
    const pills      = document.querySelectorAll('.paps-pill');
    const exStep     = document.getElementById('papsExerciseStep');
    const exList     = document.getElementById('papsExerciseList');
    const valStep    = document.getElementById('papsValueStep');
    const unitEl     = document.getElementById('papsUnit');
    const valInput   = document.getElementById('papsValueInput');
    const hiddenSel  = document.getElementById('papsWeakness');
    const gradeBadge = document.getElementById('papsGradeBadge');
    const gradeText  = document.getElementById('papsGradeText');
    const confirmBtn = document.getElementById('papsConfirmBtn');

    function handleValueChange() {
      const v = parseFloat(valInput.value);
      if (isNaN(v) || !selectedExId) {
        gradeBadge.style.display = 'none';
        return;
      }

      // Special case: BMI
      if (selectedExId === 'bmi') {
        gradeBadge.style.display = 'block';
        const currentBmi = v;
        let g = '정상', gc = '#22c55e';
        if (currentBmi < 18.5) { g = '저체중'; gc = '#60a5fa'; }
        else if (currentBmi < 23) { g = '정상'; gc = '#22c55e'; }
        else if (currentBmi < 25) { g = '과체중'; gc = '#f97316'; }
        else { g = '비만'; gc = '#ef4444'; }
        
        gradeText.innerHTML = `<span style="font-size:1.05rem; font-weight:800;">${g}</span>`;
        gradeText.style.color = gc;
        
        const inner = gradeBadge.querySelector('div');
        if (inner) {
          inner.style.background = 'rgba(6, 182, 212, 0.08)';
          inner.style.borderColor = 'rgba(6, 182, 212, 0.2)';
        }
        return;
      }

      const age = parseInt(ageInput.value);
      const yearKey = AGE_TO_YEAR[age];
      if (!yearKey) {
        gradeBadge.style.display = 'block';
        gradeText.textContent = '해당 학년 데이터 없음';
        gradeText.style.color = 'var(--text-muted)';
        return;
      }

      const gender = genderSelect.value;
      const result = evalPapsGrade(v, selectedExId, yearKey, gender);
      
      gradeBadge.style.display = 'block';
      const inner = gradeBadge.querySelector('div');

      if (!result) {
        gradeText.textContent = '범위 외 수치';
        gradeText.style.color = 'var(--text-muted)';
        if (inner) inner.style.background = 'rgba(148, 163, 184, 0.08)';
        return;
      }

      const rangeStr = result.range ? `(${result.range[0]} ~ ${result.range[1]} ${unitEl.textContent})` : '';
      gradeText.innerHTML = `${result.stars} <span style="font-size:1rem">${result.label}</span> <span style="font-size:0.75rem;opacity:0.7">${result.name} ${rangeStr}</span>`;
      gradeText.style.color = result.color;
      if (inner) {
        inner.style.background = result.bg;
        inner.style.borderColor = result.color.replace(')', ',0.3)').replace('rgb', 'rgba');
      }
    }

    // Save/Commit PAPS Score when Confirm Button is clicked
    confirmBtn.addEventListener('click', function() {
      const v = parseFloat(valInput.value);
      if (isNaN(v) || !selectedExId || !selectedCat) {
        alert("올바른 측정 수치를 입력해주세요!");
        return;
      }

      // Special case: BMI
      if (selectedExId === 'bmi') {
        const currentBmi = v;
        let g = '정상', gc = '#22c55e', idx = 2;
        if (currentBmi < 18.5) { g = '저체중'; gc = '#60a5fa'; idx = 0; }
        else if (currentBmi < 23) { g = '정상'; gc = '#22c55e'; idx = 1; }
        else if (currentBmi < 25) { g = '과체중'; gc = '#f97316'; idx = 2; }
        else { g = '비만'; gc = '#ef4444'; idx = 3; }
        
        userPapsScores.body = {
          id: 'bmi',
          score: currentBmi,
          gradeIdx: idx,
          gradeText: g,
          color: gc
        };
      } else {
        const age = parseInt(ageInput.value);
        const yearKey = AGE_TO_YEAR[age];
        if (!yearKey) {
          alert("해당 학년에 대한 PAPS 평가 데이터가 없습니다.");
          return;
        }
        
        const gender = genderSelect.value;
        const result = evalPapsGrade(v, selectedExId, yearKey, gender);
        if (!result) {
          alert("입력한 수치가 평가 가능한 범위를 벗어났습니다.");
          return;
        }
        
        userPapsScores[selectedCat] = {
          id: selectedExId,
          score: v,
          gradeIdx: result.idx,
          gradeText: `${result.label} (${result.name})`,
          color: result.color
        };
      }

      // Save userPapsScores to LocalStorage
      localStorage.setItem('neoFitPapsScores', JSON.stringify(userPapsScores));

      // Trigger Visual Updates
      updateDashboard();
      updateRecommendations();

      // Show grade badge successfully
      gradeBadge.style.display = 'block';
      handleValueChange();

      // Premium Micro-interaction feedback animation
      const originalHtml = confirmBtn.innerHTML;
      confirmBtn.innerHTML = `<i class="fas fa-check-circle"></i> 기록 저장 및 대시보드 반영 완료!`;
      confirmBtn.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(34, 197, 94, 0.25) 100%)';
      confirmBtn.style.borderColor = 'var(--success-glow)';
      confirmBtn.style.color = 'var(--success-glow)';
      confirmBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.35)';

      setTimeout(() => {
        confirmBtn.innerHTML = originalHtml;
        confirmBtn.style.background = '';
        confirmBtn.style.borderColor = '';
        confirmBtn.style.color = '';
        confirmBtn.style.boxShadow = '';
      }, 1800);
    });

    pills.forEach(pill => {
      pill.addEventListener('click', function() {
        pills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        selectedCat = this.dataset.cat;
        
        // Restore category state from userPapsScores tracker if active!
        const savedState = userPapsScores[selectedCat];
        if (savedState && savedState.id) {
          selectedExId = savedState.id;
          const papsEx = PAPS_DATA[selectedCat].exercises.find(e => e.id === selectedExId);
          selectedExUnit = papsEx ? papsEx.unit : '';
        } else {
          selectedExId = selectedExUnit = null;
        }

        hiddenSel.value = selectedCat === 'body' ? 'all' : selectedCat;

        const data = PAPS_DATA[selectedCat];
        exList.innerHTML = '';
        
        data.exercises.forEach(ex => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'paps-exercise-btn';
          btn.dataset.exId = ex.id;
          btn.dataset.unit = ex.unit;
          btn.innerHTML = `<i class="${ex.icon} ex-icon"></i>${ex.name}<span style="margin-left:auto;font-size:0.75rem;opacity:0.55;">${ex.unit}</span>`;
          
          if (selectedExId === ex.id) {
            btn.classList.add('active');
          }
          
          btn.addEventListener('click', function() {
            document.querySelectorAll('.paps-exercise-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedExUnit = this.dataset.unit;
            selectedExId = this.dataset.exId;
            unitEl.textContent = this.dataset.unit;
            
            // Save active exercise ID in state tracker
            if (!userPapsScores[selectedCat]) {
              userPapsScores[selectedCat] = { id: selectedExId, score: null, gradeIdx: null };
            } else {
              userPapsScores[selectedCat].id = selectedExId;
            }
            
            // Restore score to input field if present, otherwise clear
            const savedScore = userPapsScores[selectedCat].score;
            valInput.value = savedScore !== null ? savedScore : '';
            
            valStep.style.display = 'block';
            valInput.focus();
            
            handleValueChange();
          });
          exList.appendChild(btn);
        });

        exStep.style.display  = 'block';
        
        // If an exercise was already active in this category, restore input fields immediately
        if (selectedExId) {
          valStep.style.display = 'block';
          unitEl.textContent = selectedExUnit;
          const savedScore = savedState ? savedState.score : null;
          valInput.value = savedScore !== null ? savedScore : '';
          
          if (savedScore !== null) {
            handleValueChange();
          } else {
            gradeBadge.style.display = 'none';
          }
        } else {
          valStep.style.display = 'none';
          gradeBadge.style.display = 'none';
        }
      });
    });

    valInput.addEventListener('input', handleValueChange);

    // Re-evaluate when inputs change
    ['userAge', 'userGender'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        handleValueChange();
      });
    });
  }

  // Fetch and parse KMA weather CSV dynamically
  function loadKmaCsv() {
    console.log("Attempting to dynamically fetch KMA CSV data...");
    fetch('기상청 (2).csv')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch 기상청 (2).csv');
        return response.text();
      })
      .then(text => {
        const lines = text.split('\n');
        if (lines.length < 2) return;
        
        const dailyRaw = {};
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(',');
          if (parts.length < 16) continue;
          
          const dateStr = parts[0];
          if (!dateStr || dateStr.length < 10) continue;
          
          const datePart = dateStr.split(' ')[0];
          const dateParts = datePart.split('-');
          if (dateParts.length < 3) continue;
          
          const month = parseInt(dateParts[1], 10);
          const day = parseInt(dateParts[2], 10);
          const key = `${month}-${day}`;
          
          if (!dailyRaw[key]) {
            dailyRaw[key] = { temps: [], winds: [], hums: [], rains: [] };
          }
          
          const tempVal = parseFloat(parts[11]);
          const windVal = parseFloat(parts[3]);
          const humVal = parseFloat(parts[13]);
          const rainVal = parts[15] ? parseFloat(parts[15]) : 0;
          
          if (!isNaN(tempVal)) dailyRaw[key].temps.push(tempVal);
          if (!isNaN(windVal)) dailyRaw[key].winds.push(windVal);
          if (!isNaN(humVal)) dailyRaw[key].hums.push(humVal);
          dailyRaw[key].rains.push(rainVal);
        }
        
        for (const key in dailyRaw) {
          const data = dailyRaw[key];
          if (data.temps.length === 0) continue;
          
          const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
          const avgHum = data.hums.reduce((a, b) => a + b, 0) / data.hums.length;
          const avgWind = data.winds.reduce((a, b) => a + b, 0) / data.winds.length;
          const sumRain = data.rains.reduce((a, b) => a + b, 0);
          
          if (!WEATHER_DATA[key]) {
            WEATHER_DATA[key] = {
              month: parseInt(key.split('-')[0], 10),
              day: parseInt(key.split('-')[1], 10),
              dust: 50,
              dust_desc: '보통',
              uv: 2.0,
              uv_desc: '보통'
            };
          }
          
          WEATHER_DATA[key].temp = parseFloat(avgTemp.toFixed(1));
          WEATHER_DATA[key].humidity = parseFloat(avgHum.toFixed(1));
          WEATHER_DATA[key].wind = parseFloat(avgWind.toFixed(1));
          WEATHER_DATA[key].rain = parseFloat(sumRain.toFixed(1));
        }
        console.log("KMA CSV loaded and parsed dynamically successfully! Integrated 365 days weather data.");
        
        // Trigger display updates once dynamic KMA data is aggregated
        updateWeather();
        updateRecommendations();
      })
      .catch(err => {
        console.warn("Could not load 기상청 (2).csv dynamically (possibly local file:// CORS or file missing). Using static pre-compiled WEATHER_DATA fallback.", err);
      });
  }

  /* ── 7. Global Application Init ── */
  
  function init() {
    // 1. Initialize days dynamic adjustment
    initDays();

    // 2. Setup standard DOM event listeners
    [heightInput, weightInput, ageInput, genderSelect].forEach(el => {
      el.addEventListener('change', () => {
        updateBmi();
        updateRecommendations();
      });
      el.addEventListener('input', () => {
        updateBmi();
        updateRecommendations();
      });
    });

    screenTimeIn.addEventListener('input', () => {
      updateDetox();
      updateRecommendations();
    });
    
    // Dynamic month changes adjust the maximum days select option
    monthSelect.addEventListener('change', () => {
      initDays();
      updateWeather();
      updateRecommendations();
    });
    
    daySelect.addEventListener('change', () => {
      updateWeather();
      updateRecommendations();
    });

    // 3. Setup PAPS multi-step listeners
    setupPapsListeners();

    // 4. Load saved PAPS scores from LocalStorage
    try {
      const savedScores = localStorage.getItem('neoFitPapsScores');
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        for (const cat in parsed) {
          if (userPapsScores[cat] !== undefined) {
            userPapsScores[cat] = parsed[cat];
          }
        }
        console.log("Restored saved PAPS scores from LocalStorage:", userPapsScores);
      }
    } catch (e) {
      console.warn("Could not restore saved PAPS scores from LocalStorage:", e);
    }

    // 5. Load KMA CSV weather data
    loadKmaCsv();

    // 6. Initial trigger of status updates
    updateBmi();
    updateDetox();
    updateWeather();
    updateRecommendations();
  }

  // Wait for DOM content to load fully
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
