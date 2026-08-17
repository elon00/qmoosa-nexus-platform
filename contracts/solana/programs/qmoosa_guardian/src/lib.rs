// QMoosa Nexus Solana Policy Guardian Program
// Anchor Framework Implementation for Sub-Second Agent Execution

use anchor_lang::prelude::*;

declare_id!("QMoosAGuardian11111111111111111111111111111");

#[program]
pub mod qmoosa_guardian {
    use super::*;

    pub fn initialize_policy(
        ctx: Context<InitializePolicy>,
        max_daily_spending_usdt: u64,
        max_per_tx_usdt: u64,
        risk_score_threshold: u8,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.spending_policy;
        policy.authority = ctx.accounts.authority.key();
        policy.max_daily_spending_usdt = max_daily_spending_usdt;
        policy.max_per_tx_usdt = max_per_tx_usdt;
        policy.spent_today_usdt = 0;
        policy.last_reset_slot = Clock::get()?.slot;
        policy.risk_score_threshold = risk_score_threshold;
        policy.emergency_pause = false;
        Ok(())
    }

    pub fn execute_agent_transfer(
        ctx: Context<ExecuteAgentTransfer>,
        amount_usdt: u64,
        risk_score: u8,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.spending_policy;
        
        // 1. Verify emergency pause
        require!(!policy.emergency_pause, GuardianError::EmergencyPauseActive);

        // 2. Verify per-tx limit
        require!(amount_usdt <= policy.max_per_tx_usdt, GuardianError::ExceedsPerTxLimit);

        // 3. Verify risk score
        require!(risk_score <= policy.risk_score_threshold, GuardianError::RiskThresholdExceeded);

        // 4. Verify daily spending limit
        require!(policy.spent_today_usdt + amount_usdt <= policy.max_daily_spending_usdt, GuardianError::ExceedsDailyLimit);

        // 5. Update daily spent state
        policy.spent_today_usdt += amount_usdt;

        msg!("QMoosa Solana Agent Execution Verified for {} USDT", amount_usdt);
        Ok(())
    }

    pub fn toggle_pause(ctx: Context<TogglePause>, is_paused: bool) -> Result<()> {
        let policy = &mut ctx.accounts.spending_policy;
        require!(ctx.accounts.authority.key() == policy.authority, GuardianError::Unauthorized);
        policy.emergency_pause = is_paused;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePolicy<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 8 + 8 + 1 + 1,
        seeds = [b"policy", authority.key().as_ref()],
        bump
    )]
    pub spending_policy: Account<'info, PolicyAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteAgentTransfer<'info> {
    #[account(mut, seeds = [b"policy", spending_policy.authority.as_ref()], bump)]
    pub spending_policy: Account<'info, PolicyAccount>,
    pub agent_signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct TogglePause<'info> {
    #[account(mut, seeds = [b"policy", spending_policy.authority.as_ref()], bump)]
    pub spending_policy: Account<'info, PolicyAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct PolicyAccount {
    pub authority: Pubkey,
    pub max_daily_spending_usdt: u64,
    pub max_per_tx_usdt: u64,
    pub spent_today_usdt: u64,
    pub last_reset_slot: u64,
    pub risk_score_threshold: u8,
    pub emergency_pause: bool,
}

#[error_code]
pub enum GuardianError {
    #[msg("Emergency Pause is active on this Smart Account.")]
    EmergencyPauseActive,
    #[msg("Transaction amount exceeds maximum per-tx limit.")]
    ExceedsPerTxLimit,
    #[msg("Transaction amount exceeds remaining daily spending limit.")]
    ExceedsDailyLimit,
    #[msg("Risk score exceeds allowed safety threshold.")]
    RiskThresholdExceeded,
    #[msg("Unauthorized access.")]
    Unauthorized,
}
