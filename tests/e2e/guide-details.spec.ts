import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {guides} from '../../data/guides';

test.beforeEach(async({context})=>{await context.addInitScript(()=>localStorage.setItem('gospeed-privacy-v1','essential'));});

test('expanded explanations and FAQs are present in every guide response',async({page,request})=>{
 test.setTimeout(120000);
 for(const guide of guides){
  const response=await request.get(`/guides/${guide.slug}`);expect(response.status(),guide.slug).toBe(200);
  const html=await response.text();
  const info=await page.evaluate(html=>{const doc=new DOMParser().parseFromString(html,'text/html');return {headings:[...doc.querySelectorAll('article h2')].map(h=>h.textContent),questions:[...doc.querySelectorAll('#faq summary')].map(s=>s.textContent),answers:[...doc.querySelectorAll('#faq details p')].map(p=>p.textContent),exampleImages:doc.querySelectorAll('.guide-example-photo img').length,tables:doc.querySelectorAll('article table').length,targets:[...doc.querySelectorAll('.guide-toc a')].map(a=>!!doc.querySelector(a.getAttribute('href')!)),article:JSON.parse([...doc.querySelectorAll('script[type="application/ld+json"]')].find(s=>s.textContent?.includes('"@type":"Article"'))!.textContent!)};},html);
  for(const section of guide.sections)expect(info.headings).toContain(section.heading);
  expect(info.questions).toEqual(guide.faqs.map(f=>f.question));expect(info.answers).toEqual(guide.faqs.map(f=>f.answer));expect(info.targets.every(Boolean)).toBe(true);expect(info.exampleImages).toBe(1);expect(info.tables).toBeGreaterThanOrEqual(1);
  expect(info.article.headline).toBe(guide.title);expect(info.article.mainEntityOfPage).toBe(`https://gospeedraceway.com/guides/${guide.slug}`);
 }
});

test('sprocket and power guides use supplied images and readable responsive layouts',async({page},testInfo)=>{
 test.setTimeout(120000);
 for(const [slug,folder] of [['sprocket-pitch-diameter','sprocket_geometry'],['torque-vs-horsepower','torque_horsepower'],['dirt-bike-gearing','images/hd']]){
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`/guides/${slug}`);await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.guide-detail-hero>img')).toBeVisible();expect(decodeURIComponent(await page.locator('.guide-detail-hero>img').getAttribute('src')??'')).toContain('/'+folder+'/');
  for(const img of await page.locator('img:visible').all()){await img.scrollIntoViewIfNeeded();await expect(img).toHaveJSProperty('complete',true);expect(await img.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('navigation',{name:'On this page',exact:true}).getByRole('link',{name:'Frequently asked questions',exact:true}).click();await expect(page).toHaveURL(/#faq$/);
  const question=page.locator('#faq summary').first();await question.focus();await page.keyboard.press('Enter');await expect(page.locator('#faq details').first()).toHaveAttribute('open','');await expect(page.locator('#faq details p').first()).toBeVisible();
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(errors).toEqual([]);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/evidence/guide-${slug}-${testInfo.project.name}.png`,fullPage:true});
 }
});

test('core explanations and native FAQs work without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();
 await page.goto('/guides/sprocket-pitch-diameter');await expect(page.getByRole('table').first()).toBeVisible();await expect(page.locator('article')).toContainText('3.19623 inches');
 await page.locator('#faq summary').first().click();await expect(page.locator('#faq details p').first()).toBeVisible();
 await page.getByRole('navigation',{name:'On this page',exact:true}).getByRole('link',{name:'Work through an example',exact:true}).click();await expect(page).toHaveURL(/#example$/);await context.close();
});
