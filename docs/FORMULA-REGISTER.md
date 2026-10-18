# Formula register

Research and implementation date: October 18, 2026. Canonical SI arithmetic is independent of React. The original explanations are based on dimensional derivation and the references below; sources do not endorse this implementation.

| Family | Method and dimensions | Scope and independent check |
| --- | --- | --- |
| Sprocket / final drive | `R = N_driven / N_driver`, dimensionless | 60/12 = 5. Applies to all application-specific ratio tools. |
| Compound jackshaft | `(N_jack_in/N_engine) × (N_axle/N_jack_out)` | 18/12 × 60/12 = 7.5. An idler does not add a reduction. |
| Full gearing | Multiply final, additional jackshaft, primary, selected gear and converter operating reductions | Each stage is dimensionless. Converter input is one selected point, never a fixed universal ratio. |
| RPM to road speed | `v = rpm × πD / (60R)`; m/s | A one-meter circumference rotating at 60 wheel rpm travels 1 m/s. Invert for ratio from measured RPM and speed. |
| Sprocket comparison | Reduction change `R₂/R₁ − 1`; fixed-RPM speed change `R₁/R₂ − 1` | 5→5.5 gives +10% reduction and −9.09% speed. Ideal wheel-torque multiplication is not measured acceleration. |
| Tire correction | `R₂ = R₁ × D₂/D₁` | 26→30 in with 4.10 gives 4.730769:1. Loaded rolling circumference is preferable to nominal diameter. |
| Chain length | `x=C/p; L≈2x+(N₁+N₂)/2+(N₂−N₁)²/(4π²x)` pitches | Two-sprocket open drive. Round up to even pitches. Equal 20T sprockets, 0.5-in pitch and 10-in centers give 60 pitches. |
| Revised chain centers | Let `b=selected_L−(N₁+N₂)/2`; `C=p[b+sqrt(b²−2(N₂−N₁)²/π²)]/4` | Algebraic inverse of the approximation; not an exact chain-fit solver. Physical overlap is rejected. Suspension, sag and tensioners are excluded. |
| Quarter-mile ET | `ET=5.825(W_lb/HP)^(1/3)` | Hale empirical coefficient model. 3,200 lb / 400 hp = 8; ET = 11.65 s. |
| Quarter-mile trap | `mph=234(HP/W_lb)^(1/3)` | Same hand-check yields 117 MPH. Not average course speed or guaranteed terminal speed. |
| ET to power | `HP=W_lb/(ET/5.825)³` | Inverts the model only; 3,200 lb and 11.65 s imply 400 hp. No dyno measurement is inferred. |
| Eighth to quarter | `quarter_ET=eighth_ET × user_factor` | Explicit heuristic, default 1.57. 8 s gives 12.56 s. No universal empirical accuracy is claimed. |
| Dial-in worksheet | Mean of three ETs + user margin; observed range and population SD | 12.10, 12.12, 12.08 + 0.02 margin → 12.12 s. Not a prediction interval or weather correction. |
| Moist air | `e=(RH/100)6.1078·10^(7.5T/(237.3+T))` hPa; `ρ=(P−e)100/(287.05Tk)+e100/(461.495Tk)` | NWS saturation-vapor relation with ideal dry/vapor gas components. Actual station pressure required. |
| Density altitude | `h=44330.77[1−(ρ/1.225)^(1/4.25588)]` m | Inverse ISA tropospheric density. Dry 15°C, 1013.25 hPa ≈ 1.225 kg/m³ and 0 m. Input range −40 to 60°C, 500–1100 hPa. Not an aviation instrument. |
| Power-to-weight | kW / kg × 1000; hp / (lb/2000); lb / hp | Distinguishes metric tonne and US short ton. 400 hp / 3,200 lb = 250 hp/US ton and 8 lb/hp. |
| 0–60 worksheet | `a=g_input·9.80665; v=26.8224 m/s; t=v/a; d=v²/(2a)` | Time uses entered interval-average acceleration. Distance assumes constant acceleration. Not a horsepower-derived prediction. |
| Torque to power | `P(kW)=T(Nm)·rpm·2π/60000` | 1 Nm at 60 rpm gives 2π W; 400 lbf·ft at about 5,252.11 rpm gives 400 mechanical hp. |
| Wheel power | `P_wheel=P_engine(1−loss/100)` | User scenario only. 400 hp at 15% assumed loss → 340 hp. No drivetrain-type loss specifications invented. |
| Nominal tire size | `D_mm=rim_in·25.4+2·width_mm·aspect/100` | 205/55R16 gives 631.9 mm. Rim designation stays inches; width stays mm. |
| Circumference | `C=πD`; `rev/mile=1609.344/C_m` | A one-meter circumference gives 1,609.344 rev/mile. Geometry differs from loaded rolling circumference. |
| Pitch circle | `PD=p/sin(π/N)` | Derivation: regular polygon chord `p=2r sin(π/N)`. Six teeth give PD=2p. Not outside diameter or a manufacturing profile. |
| Average chain speed | `v_chain=p·N_driver·rpm/60`; `rpm_driven=rpm_driver·N_driver/N_driven` | Half-inch pitch, 12 teeth, 600 rpm gives 1.524 m/s. Average pitch advance accounts correctly for chordal geometry; safe rating is excluded. |

## References checked

- [Renold transmission chain installation and designer guide](https://www.renold.com/media/165418/transmission-i-and-m-ren12-eng-10-10.pdf): chain-length model and even-pitch selection. PDF text extraction can misread mathematical symbols; the implementation uses the conventional dimensionally consistent form and independently checks equal-sprocket geometry and the inverse.
- [OpenStax University Physics: rotation](https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration): angular and tangential motion foundations.
- [NASA Glenn: power](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/power/): rate of work and mechanical horsepower foundation.
- [NIST SP 811](https://pml.nist.gov/cuu/pdf/sp811.pdf): SI unit and conversion conventions.
- [Jeff Lucius / Stealth 316 quarter-mile formulas and original regression analysis](https://www.stealth316.com/2-calc-hp-et-mph.htm): documents Hale's 5.825/234 coefficient pair and distinguishes it from other models. No historical accuracy or author credentials from this source are transferred to this platform.
- [NWS density-altitude equations](https://www.weather.gov/media/epz/wxcalc/densityAltitude.pdf): vapor-pressure and moist-air treatment. This app uses an ideal-gas density mixture plus inverse ISA density; it does not duplicate every rounding choice in the NWS script.
- [OpenStax constant-acceleration equations](https://openstax.org/books/physics/pages/3-2-representing-acceleration-with-equations-and-graphs): 0–60 worksheet's kinematic basis.

## Validation limits

Mathematical fixtures and monotonicity checks validate the implemented relationships. They do not calibrate empirical drag coefficients, validate user assumptions, certify component fit or replace physical vehicle testing. A professional motorsport review has not been performed or claimed. Field performance data and manufacturer-specific specifications are deliberately absent.
