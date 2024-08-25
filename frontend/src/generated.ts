import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vaquinha
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaquinhaAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vaquinhaId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'contribuinte',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'valor',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContribuicaoRecebida',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vaquinhaId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'valor',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SaqueRealizado',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vaquinhaId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'nome', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'objetivo',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'duracao',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VaquinhaCriada',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vaquinhaId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VaquinhaDeletada',
  },
  {
    type: 'function',
    inputs: [{ name: 'vaquinhaId', internalType: 'uint256', type: 'uint256' }],
    name: 'contribute',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nome', internalType: 'string', type: 'string' },
      { name: 'objetivo', internalType: 'uint256', type: 'uint256' },
      { name: 'duracaoDias', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVaquinha',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'vaquinhaId', internalType: 'uint256', type: 'uint256' }],
    name: 'deleteVaquinha',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'vaquinhaId', internalType: 'uint256', type: 'uint256' }],
    name: 'getVaquinha',
    outputs: [
      { name: '', internalType: 'string', type: 'string' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVaquinhaCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'vaquinhas',
    outputs: [
      { name: 'nome', internalType: 'string', type: 'string' },
      { name: 'criador', internalType: 'address payable', type: 'address' },
      { name: 'objetivo', internalType: 'uint256', type: 'uint256' },
      { name: 'saldo', internalType: 'uint256', type: 'uint256' },
      { name: 'dataCriacao', internalType: 'uint256', type: 'uint256' },
      { name: 'duracao', internalType: 'uint256', type: 'uint256' },
      { name: 'ativa', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'vaquinhaId', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaquinhaAbi}__
 */
export const useReadVaquinha = /*#__PURE__*/ createUseReadContract({
  abi: vaquinhaAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"getVaquinha"`
 */
export const useReadVaquinhaGetVaquinha = /*#__PURE__*/ createUseReadContract({
  abi: vaquinhaAbi,
  functionName: 'getVaquinha',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"getVaquinhaCount"`
 */
export const useReadVaquinhaGetVaquinhaCount =
  /*#__PURE__*/ createUseReadContract({
    abi: vaquinhaAbi,
    functionName: 'getVaquinhaCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"vaquinhas"`
 */
export const useReadVaquinhaVaquinhas = /*#__PURE__*/ createUseReadContract({
  abi: vaquinhaAbi,
  functionName: 'vaquinhas',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaquinhaAbi}__
 */
export const useWriteVaquinha = /*#__PURE__*/ createUseWriteContract({
  abi: vaquinhaAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"contribute"`
 */
export const useWriteVaquinhaContribute = /*#__PURE__*/ createUseWriteContract({
  abi: vaquinhaAbi,
  functionName: 'contribute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"createVaquinha"`
 */
export const useWriteVaquinhaCreateVaquinha =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaquinhaAbi,
    functionName: 'createVaquinha',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"deleteVaquinha"`
 */
export const useWriteVaquinhaDeleteVaquinha =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaquinhaAbi,
    functionName: 'deleteVaquinha',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteVaquinhaWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: vaquinhaAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaquinhaAbi}__
 */
export const useSimulateVaquinha = /*#__PURE__*/ createUseSimulateContract({
  abi: vaquinhaAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"contribute"`
 */
export const useSimulateVaquinhaContribute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaquinhaAbi,
    functionName: 'contribute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"createVaquinha"`
 */
export const useSimulateVaquinhaCreateVaquinha =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaquinhaAbi,
    functionName: 'createVaquinha',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"deleteVaquinha"`
 */
export const useSimulateVaquinhaDeleteVaquinha =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaquinhaAbi,
    functionName: 'deleteVaquinha',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaquinhaAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateVaquinhaWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaquinhaAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaquinhaAbi}__
 */
export const useWatchVaquinhaEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaquinhaAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaquinhaAbi}__ and `eventName` set to `"ContribuicaoRecebida"`
 */
export const useWatchVaquinhaContribuicaoRecebidaEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaquinhaAbi,
    eventName: 'ContribuicaoRecebida',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaquinhaAbi}__ and `eventName` set to `"SaqueRealizado"`
 */
export const useWatchVaquinhaSaqueRealizadoEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaquinhaAbi,
    eventName: 'SaqueRealizado',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaquinhaAbi}__ and `eventName` set to `"VaquinhaCriada"`
 */
export const useWatchVaquinhaVaquinhaCriadaEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaquinhaAbi,
    eventName: 'VaquinhaCriada',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaquinhaAbi}__ and `eventName` set to `"VaquinhaDeletada"`
 */
export const useWatchVaquinhaVaquinhaDeletadaEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaquinhaAbi,
    eventName: 'VaquinhaDeletada',
  })
