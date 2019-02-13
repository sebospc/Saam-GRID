function [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_ext,T_initial,th_A,K_A,th_B,K_B,th_C,K_C,L_C,W_C,H_C)


%syms T_ext T_initial th_A A_A K_A th_B A_B K_B th_C A_C K_C L_C W_C H_C

% T_ext=303;
% T_initial=273;
% 
% th_A=0.01;
% th_B=0.025;
% th_C=0.01;
% 
% L_C=0.4;
% H_C=0.4;
% W_C=0.3125;
% 
% K_A=0.128;
% K_B=0.035;
% K_C=0.128;
% 

h_A=K_A/th_A;
h_B=K_B/th_B;
h_C=K_C/th_C;


A_Effective=2*H_C*(L_C+W_C);

Delta_T_ext_0=3;
Delta_T_in_0=3;

T_0=T_ext;
T_5=T_initial;

h_ext=5.6*(Delta_T_ext_0/(H_C*T_0))^.25;
h_int=5.6*(Delta_T_in_0/(H_C*T_5))^.25;

heq_pr=1/h_ext + 1/h_A + 1/h_B + 1/h_C + 1/h_int;

Q=1/heq_pr*A_Effective*(T_0-T_5);

Delta_T_ext=Q/(h_ext*A_Effective);
Delta_T_in=Q/(h_int*A_Effective);
error_Delta_Text=abs(Delta_T_ext-Delta_T_ext_0);
error_Delta_Tint=abs(Delta_T_in-Delta_T_in_0);

T_1=T_0-Q/(h_ext*A_Effective);
T_2=T_1-Q/(h_A*A_Effective);
T_3=T_2-Q/(h_B*A_Effective);
T_4=T_3-Q/(h_C*A_Effective);

Temp=[T_0 T_1 T_2 T_3 T_4 T_5];

i=1;

while (i<100)
    
    if (error_Delta_Text>0.1)
        Delta_T_ext_0=Delta_T_ext_0+0.1;
    end
    
    if (error_Delta_Tint>0.1)
        Delta_T_in_0=Delta_T_in_0+0.1;
    end
    

    h_ext=5.6*(Delta_T_ext_0/(H_C*T_0))^.25;
    h_int=5.6*(Delta_T_in_0/(H_C*T_5))^.25;

    heq_pr=1/h_ext+1/h_A+1/h_B+1/h_C+1/h_int;

    Q=1/heq_pr*A_Effective*(T_0-T_5);

    Delta_T_ext=Q/(h_ext*A_Effective);
    Delta_T_in=Q/(h_int*A_Effective);
    error_Delta_Text=abs(Delta_T_ext-Delta_T_ext_0);
    error_Delta_Tint=abs(Delta_T_in-Delta_T_in_0);
    
    T_1=T_0-Q/(h_ext*A_Effective);
    T_2=T_1-Q/(h_A*A_Effective);
    T_3=T_2-Q/(h_B*A_Effective);
    T_4=T_3-Q/(h_C*A_Effective);
    
    Temp=[Temp;T_0 T_1 T_2 T_3 T_4 T_5];
    
    i=i+1;
end