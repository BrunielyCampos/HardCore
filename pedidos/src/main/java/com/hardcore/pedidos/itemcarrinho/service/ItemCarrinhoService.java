package com.hardcore.pedidos.itemcarrinho.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoRequestDTO;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoResponseDTO;
import com.hardcore.pedidos.itemcarrinho.exception.ItemCarrinhoNaoEncontradoException;
import com.hardcore.pedidos.itemcarrinho.mapper.ItemCarrinhoMapper;
import com.hardcore.pedidos.itemcarrinho.model.ItemCarrinho;
import com.hardcore.pedidos.itemcarrinho.repository.ItemCarrinhoRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemCarrinhoService {

    private final ItemCarrinhoMapper itemCarrinhoMapper;
    private final ItemCarrinhoRepository itemCarrinhoRepository;

    @Transactional
    public ItemCarrinhoResponseDTO adicionarItem(ItemCarrinhoRequestDTO requestDTO) {
        List<ItemCarrinho> itens = itemCarrinhoRepository.findByIdCarrinho(requestDTO.getIdCarrinho());
        
        ItemCarrinho itemExistente = itens.stream()
                .filter(i -> i.getIdProduto().equals(requestDTO.getIdProduto()))
                .findFirst()
                .orElse(null);

        if (itemExistente != null) {
            itemExistente.setQuantidade(itemExistente.getQuantidade() + requestDTO.getQuantidade());
            ItemCarrinho salvo = itemCarrinhoRepository.save(itemExistente);
            return itemCarrinhoMapper.toDTO(salvo);
        } else {
            ItemCarrinho novoItem = itemCarrinhoMapper.toEntity(requestDTO);
            novoItem.setId(null);
            ItemCarrinho salvo = itemCarrinhoRepository.save(novoItem);
            return itemCarrinhoMapper.toDTO(salvo);
        }
    }

    public List<ItemCarrinhoResponseDTO> listarItensPorCarrinho(Long idCarrinho) {
        List<ItemCarrinho> itens = itemCarrinhoRepository.findByIdCarrinho(idCarrinho);
        return itens.stream()
                .map(itemCarrinhoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removerItem(Long id) {
        if (!itemCarrinhoRepository.existsById(id)) {
            throw new ItemCarrinhoNaoEncontradoException("Item do carrinho não encontrado com o ID: " + id);
        }
        itemCarrinhoRepository.deleteById(id);
    }
}