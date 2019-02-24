import math as math
import skfuzzy as fuzzy

Domaines = [[295,	310],
            [273,	278],
            [0.01,	0.03],
            [0.128,	0.128],
            [0.01,	0.03],
            [0.035,	0.035],
            [0.01,	0.03],
            [0.128,	0.128],
            [20,	30],
            [4181.3,	4181.3],
            [18000,	18000],
            [60,	80],
            [0.4,	0.6],
            [0.2,	0.45],
            [0.2,	0.5],
            [0.03,	0.04],
            [880,	880],
            [28,	28],
            [880,	880]]

Pr1 = 'Internal temperature'
Pr1_minAC = 273
Pr1_minOk = 277.5
Pr1_aclevel = 281.5
Pr1_maxOK = 283


Pr2_minAC = 70e6
Pr2_minOk = 70e6
Pr2_aclevel = 80e6
Pr2_maxOK = 80e6

Pr3_minAC = 0.45
Pr3_minOk = 0.45
Pr3_aclevel = 0.7
Pr3_maxOK = 0.932

Pr4_minAC = 0.35
Pr4_minOk = 0.35
Pr4_aclevel = 0.45
Pr4_maxOK = 0.63

Pr5_minAC = 0.40
Pr5_minOk = 0.40
Pr5_aclevel = 0.50
Pr5_maxOK = 0.58


Pr6_minAC = 5
Pr6_minOk = 14
Pr6_aclevel = 18
Pr6_maxOK = 20

Pr7_minAC = 0.035
Pr7_minOk = 0.045
Pr7_aclevel = 0.05
Pr7_maxOK = 0.052

Desirability_limits = [[Pr1_minAC, Pr1_minOk, Pr1_aclevel, Pr1_maxOK],
                       [Pr2_minAC, Pr2_minOk, Pr2_aclevel, Pr2_maxOK],
                       [Pr3_minAC, Pr3_minOk, Pr3_aclevel, Pr3_maxOK],
                       [Pr4_minAC, Pr4_minOk, Pr4_aclevel, Pr4_maxOK],
                       [Pr5_minAC, Pr5_minOk, Pr5_aclevel, Pr5_maxOK],
                       [Pr6_minAC, Pr6_minOk, Pr6_aclevel, Pr6_maxOK],
                       [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_maxOK]]


T_5_mean = 273
T_0_mean = 303
M_mean = 25
Cp_mean = 4181.3
t_mean = 18000

th_A_mean = float(open('InputData_thA.txt').readline())
th_B_mean = float(open('InputData_thB.txt').readline())
th_C_mean = float(open('InputData_thC.txt').readline())
L_C_mean = float(open('InputData_LC.txt').readline())
H_C_mean = float(open('InputData_HC.txt').readline())
W_C_mean = float(open('InputData_WC.txt').readline())
th_lid_mean = float(open('InputData_thl.txt').readline())

rho_A_mean = 880
rho_B_mean = 28
rho_C_mean = 880
K_A_mean = 0.128
K_B_mean = 0.035
K_C_mean = 0.128
m_user_mean = 80

Design_variables_values = [T_0_mean,
                           T_5_mean,
                           th_A_mean,
                           K_A_mean,
                           th_B_mean,
                           K_B_mean,
                           th_C_mean,
                           K_C_mean,
                           M_mean,
                           Cp_mean,
                           t_mean,
                           m_user_mean,
                           L_C_mean,
                           W_C_mean,
                           H_C_mean,
                           th_lid_mean,
                           rho_A_mean,
                           rho_B_mean,
                           rho_C_mean]

h_A = K_A_mean/th_A_mean
h_B = K_B_mean/th_B_mean
h_C = K_C_mean/th_C_mean


A_Effective = 2*H_C_mean*(L_C_mean+W_C_mean)

Delta_T_ext_0 = 3
Delta_T_in_0 = 3

T_0 = T_0_mean
T_5 = T_5_mean

h_ext = 5.6*(Delta_T_ext_0/(H_C_mean*T_0))**.25
h_int = 5.6*(Delta_T_in_0/(H_C_mean*T_5))**.25

heq_pr = 1/h_ext + 1/h_A + 1/h_B + 1/h_C + 1/h_int

Q = 1/heq_pr*A_Effective*(T_0-T_5)

Delta_T_ext = Q/(h_ext*A_Effective)
Delta_T_in = Q/(h_int*A_Effective)
error_Delta_Text = abs(Delta_T_ext-Delta_T_ext_0)
error_Delta_Tint = abs(Delta_T_in-Delta_T_in_0)

T_1 = T_0-Q/(h_ext*A_Effective)
T_2 = T_1-Q/(h_A*A_Effective)
T_3 = T_2-Q/(h_B*A_Effective)
T_4 = T_3-Q/(h_C*A_Effective)

Temp = [T_0, T_1, T_2, T_3, T_4, T_5]


for i in range(1, 100):

    if (error_Delta_Text > 0.1):
        Delta_T_ext_0 = Delta_T_ext_0+0.1

    if (error_Delta_Tint > 0.1):
        Delta_T_in_0 = Delta_T_in_0+0.1

    h_ext = 5.6*(Delta_T_ext_0/(H_C_mean*T_0))**.25
    h_int = 5.6*(Delta_T_in_0/(H_C_mean*T_5))**.25

    heq_pr = 1/h_ext+1/h_A+1/h_B+1/h_C+1/h_int

    Q = 1/heq_pr*A_Effective*(T_0-T_5)

    Delta_T_ext = Q/(h_ext*A_Effective)
    Delta_T_in = Q/(h_int*A_Effective)
    error_Delta_Text = abs(Delta_T_ext-Delta_T_ext_0)
    error_Delta_Tint = abs(Delta_T_in-Delta_T_in_0)

    T_1 = T_0-Q/(h_ext*A_Effective)
    T_2 = T_1-Q/(h_A*A_Effective)
    T_3 = T_2-Q/(h_B*A_Effective)
    T_4 = T_3-Q/(h_C*A_Effective)

    Temp = [Temp, [T_0, T_1, T_2, T_3, T_4, T_5]]

Rel1_raw = T_5_mean + math.exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(
    H_C_mean*T_5_mean)) ** (1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean)) ** (1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)))
Rel2_raw = (m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2 *
                                    th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean))
Rel3_raw = L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean
Rel4_raw = W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean
Rel5_raw = H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean
Rel6_raw = rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)
                                                                                                                                                                                                                                                                                   * (L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)
Rel7_raw = L_C_mean*W_C_mean*H_C_mean

Properties_Values = [Rel1_raw-273, Rel2_raw, Rel3_raw,
                     Rel4_raw, Rel5_raw, Rel6_raw, Rel7_raw*1000]

#fprintf('Temperature %6.3f�C,(DESIRABILITY: %6.3f) \n',Rel1_raw-273,fuzzy.zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel]))
#fprintf('Resistance %6.3fPa,(DESIRABILITY: %6.3f) \n',Rel2_raw,fuzzy.zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel]))
#fprintf('External lenght %6.3fm,(DESIRABILITY: %6.3f) \n',Rel3_raw,fuzzy.zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel]))
#fprintf('External width %6.3fm,(DESIRABILITY: %6.3f) \n',Rel4_raw,fuzzy.zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel]))
#fprintf('External height %6.3fm,(DESIRABILITY: %6.3f) \n',Rel5_raw,fuzzy.zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel]))
#fprintf('Total weight %6.3fkg,(DESIRABILITY: %6.3f) \n',Rel6_raw,fuzzy.zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel]))
#fprintf('Internal volumen %6.3fliters,(DESIRABILITY: %6.3f) \n',Rel7_raw*1000,pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel]))



th_A_Equaliser_values = [[]]*8
th_A_Equaliser_ranges = [[],[]]

th_B_Equaliser_values = [[]]*8
th_B_Equaliser_ranges = [[],[]]

th_C_Equaliser_values = [[]]*8
th_C_Equaliser_ranges = [[],[]]

L_C_Equaliser_values = [[]]*8
L_C_Equaliser_ranges = [[],[]]

W_C_Equaliser_values = [[]]*8
W_C_Equaliser_ranges = [[],[]]

H_C_Equaliser_values = [[]]*8
H_C_Equaliser_ranges = [[],[]]

th_lid_Equaliser_values = [[]]*8
th_lid_Equaliser_ranges = [[],[]]

i_values = 1
value = Domaines[2][1]
step = (Domaines[2][1]-Domaines[2][0])/24
end = Domaines[2][0]


while (value >= end):
    #th_A_Equaliser_values[0].append(value
    
    th_A_Equaliser_values[0].append(value)
    th_A_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    th_A_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    th_A_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    th_A_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    th_A_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    th_A_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    th_A_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    th_A_Agg_Des = th_A_Equaliser_values[1][i_values]*th_A_Equaliser_values[2][i_values]*th_A_Equaliser_values[3][i_values]*th_A_Equaliser_values[4][i_values]*th_A_Equaliser_values[5][i_values]*th_A_Equaliser_values[6][i_values]*th_A_Equaliser_values[7][i_values]

    th_A_Equaliser_ranges[0].append(value)
    th_A_Equaliser_ranges[1].append(th_A_Agg_Des)

    #th_B
    th_B_Equaliser_values[0].append(value)
    th_B_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    th_B_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    th_B_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    th_B_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    th_B_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    th_B_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    th_B_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    th_B_Agg_Des = th_B_Equaliser_values[1][i_values]*th_B_Equaliser_values[2][i_values]*th_B_Equaliser_values[3][i_values]*th_B_Equaliser_values[4][i_values]*th_B_Equaliser_values[5][i_values]*th_B_Equaliser_values[6][i_values]*th_B_Equaliser_values[7][i_values]

    th_B_Equaliser_ranges[0].append(value)
    th_B_Equaliser_ranges[1].append(th_B_Agg_Des)

    #th_C
    th_C_Equaliser_values[0].append(value)
    th_C_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    th_C_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    th_C_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    th_C_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    th_C_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    th_C_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    th_C_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    th_C_Agg_Des = th_C_Equaliser_values[1][i_values]*th_C_Equaliser_values[2][i_values]*th_C_Equaliser_values[3][i_values]*th_C_Equaliser_values[4][i_values]*th_C_Equaliser_values[5][i_values]*th_C_Equaliser_values[6][i_values]*th_C_Equaliser_values[7][i_values]

    th_C_Equaliser_ranges[0].append(value)
    th_C_Equaliser_ranges[1].append(th_C_Agg_Des)

    #LC
    L_C_Equaliser_values[0].append(value)
    L_C_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    L_C_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    L_C_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    L_C_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    L_C_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    L_C_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    L_C_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    L_C_Agg_Des = L_C_Equaliser_values[1][i_values]*L_C_Equaliser_values[2][i_values]*L_C_Equaliser_values[3][i_values]*L_C_Equaliser_values[4][i_values]*L_C_Equaliser_values[5][i_values]*L_C_Equaliser_values[6][i_values]*L_C_Equaliser_values[7][i_values]

    L_C_Equaliser_ranges[0].append(value)
    L_C_Equaliser_ranges[1].append(L_C_Agg_Des)

    #WC
    W_C_Equaliser_values[0].append(value)
    W_C_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    W_C_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    W_C_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    W_C_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    W_C_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    W_C_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    W_C_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    W_C_Agg_Des = W_C_Equaliser_values[1][i_values]*W_C_Equaliser_values[2][i_values]*W_C_Equaliser_values[3][i_values]*W_C_Equaliser_values[4][i_values]*W_C_Equaliser_values[5][i_values]*W_C_Equaliser_values[6][i_values]*W_C_Equaliser_values[7][i_values]

    W_C_Equaliser_ranges[0].append(value)
    W_C_Equaliser_ranges[1].append(W_C_Agg_Des)

    #HC
    H_C_Equaliser_values[0].append(value)
    H_C_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    H_C_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    H_C_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    H_C_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    H_C_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    H_C_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    H_C_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    H_C_Agg_Des = H_C_Equaliser_values[1][i_values]*H_C_Equaliser_values[2][i_values]*H_C_Equaliser_values[3][i_values]*H_C_Equaliser_values[4][i_values]*H_C_Equaliser_values[5][i_values]*H_C_Equaliser_values[6][i_values]*H_C_Equaliser_values[7][i_values]

    H_C_Equaliser_ranges[0].append(value)
    H_C_Equaliser_ranges[1].append(H_C_Agg_Des)

    #TH_LID
    th_lid_Equaliser_values[0].append(value)
    th_lid_Equaliser_values[1].append([fuzzy.zmf(Rel1_raw, [Pr1_minOk, Pr1_aclevel])])
    th_lid_Equaliser_values[2].append([fuzzy.zmf(Rel2_raw, [Pr2_minOk, Pr2_aclevel])])
    th_lid_Equaliser_values[3].append([fuzzy.zmf(Rel3_raw, [Pr3_minOk, Pr3_aclevel])])
    th_lid_Equaliser_values[4].append([fuzzy.zmf(Rel4_raw, [Pr4_minOk, Pr4_aclevel])])
    th_lid_Equaliser_values[5].append([fuzzy.zmf(Rel5_raw, [Pr5_minOk, Pr5_aclevel])])
    th_lid_Equaliser_values[6].append([fuzzy.zmf(Rel6_raw, [Pr6_minOk, Pr6_aclevel])])
    th_lid_Equaliser_values[7].append([pimf(Rel7_raw, [Pr7_minAC, Pr7_minOk, Pr7_aclevel, Pr7_aclevel])])
    
    th_lid_Agg_Des = th_lid_Equaliser_values[1][i_values]*th_lid_Equaliser_values[2][i_values]*th_lid_Equaliser_values[3][i_values]*th_lid_Equaliser_values[4][i_values]*th_lid_Equaliser_values[5][i_values]*th_lid_Equaliser_values[6][i_values]*th_lid_Equaliser_values[7][i_values]

    th_lid_Equaliser_ranges[0].append(value)
    th_lid_Equaliser_ranges[1].append(th_lid_Agg_Des)

    value = value - step
    i_values = i_values + 1

print("values", th_A_Equaliser_values)
print("ranges", th_A_Equaliser_ranges)